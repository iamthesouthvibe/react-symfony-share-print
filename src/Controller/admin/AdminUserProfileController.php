<?php

namespace App\Controller\admin;

use App\Entity\CreatorProfil;
use App\Entity\User;
use App\Services\EmailService;
use App\Services\LogServices;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class AdminUserProfileController extends AbstractController
{
    /**
     * Il s'agit d'une fonction qui renvoit la liste des utilisateurs.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/list/users', name: 'app_list_user')]
    public function getUserList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        // Get all users
        $users = $em->getRepository(User::class)->findAll();

        $data = [];
        $dataLogs = [];

        foreach ($users as $user) {
            $createdAt = ($user->getCreatedAt() !== null) ? $user->getCreatedAt()->format('Y-m-d') : '';
            $updatedAt = ($user->getUpdatedAt() !== null) ? $user->getUpdatedAt()->format('Y-m-d') : '';
            $data[] = [
               'id' => $user->getId(),
               'firstname' => $user->getFirstName(),
               'lastname' => $user->getLastName(),
               'roles' => $user->getRoles(),
               'email' => $user->getEmail(),
               'createdAt' => $createdAt,
               'updatedAt' => $updatedAt,
           ];

            $userLogs = $user->getUserLogs();
            if ($userLogs !== null) {
                foreach ($userLogs as $userLog) {
                    $dataLogs[] = [
                    'userId' => $userLog->getUser()->getId(),
                    'logId' => $userLog->getId(),
                    'message' => $userLog->getMessage(),
                    'code' => $userLog->getCode(),
                ];
                }
            }
        }

        return new JsonResponse(['users' => $data, 'logs' => array_reverse($dataLogs)]);
    }

    /**
     * Il s'agit d'une fonction qui renvoit les details d'un utilisateur.
     *
     * @param entityManagerInterface $em: une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param $id : id de l'utilisateur
     * @param JWTEncoderInterface $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request             $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/user/detail/{id}', name: 'app_details_user')]
    public function details(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em
            ->getRepository(User::class)
            ->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Aucun utilisateur trouvé avec l\'ID "%s".', $id]);
        }

        $address = $user->getAddress();
        $addressData = [];

        $creatorProfil = $user->getCreatorProfil();
        $creatorData = [];

        if ($address !== null) {
            $addressData = [
                'adressFullname' => $address->getFullName() ?? '',
                'adressSocieteName' => $address->getSocieteName() ?? '',
                'adressCountry' => $address->getCountry() ?? '',
                'adress' => $address->getAddress() ?? '',
                'adressCity' => $address->getCity() ?? '',
                'adressZip' => $address->getZip() ?? '',
            ];
        }

        if ($creatorProfil !== null) {
            $creatorData = [
                'displayname' => $creatorProfil->getDisplayName() ?? '',
                'bio' => $creatorProfil->getBio() ?? '',
                'instagram' => $creatorProfil->getInstagram() ?? '',
                'linkedin' => $creatorProfil->getLinkedin() ?? '',
                'dribble' => $creatorProfil->getDribble() ?? '',
                'behance' => $creatorProfil->getbehance() ?? '',
                'payoutFirstname' => $creatorProfil->getPayoutFirstname() ?? '',
                'payoutLastname' => $creatorProfil->getPayoutLastname() ?? '',
                'payoutOrganisation' => $creatorProfil->getPayoutOrganisation() ?? '',
                'invoiceAddress' => $creatorProfil->getInvoiceAddress() ?? '',
                'invoiceCity' => $creatorProfil->getInvoiceCity() ?? '',
                'invoiceCountry' => $creatorProfil->getInvoiceCountry() ?? '',
                'invoiceZip' => $creatorProfil->getInvoiceZip() ?? '',
                'paypalEmail' => $creatorProfil->getPaypalEmail() ?? '',
            ];
        }

        $data = array_merge($addressData, $creatorData);

        return new JsonResponse(array_merge([
            'id' => $user->getId(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ], $data));
    }

    /**
     * Il s'agit d'une fonction qui permet de supprimer un utilisateur.
     *
     * @param entityManagerInterface $em: une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param $id : id de l'utilisateur
     * @param JWTEncoderInterface $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request             $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/user/delete/{id}', name: 'app_delete_user')]
    public function deleteUser(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request, LogServices $LogServices)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$curuser) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $user = $em
            ->getRepository(User::class)
            ->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Aucun utilisateur trouvé avec l\'ID "%s".', $id]);
        }

        $LogServices->createLog($curuser, $curuser->getEmail().' a supprimé l\'utilisateur ID : '.$user->getId(), 'USER');
        $em->remove($user);
        $em->flush();

        return new JsonResponse(['success' => 'L\'utilisateur a bien été supprimé !']);
    }

    /**
     * Il s'agit d'une fonction qui permet d'ajouter ou de modifier un utilisateur.
     *
     * @param entityManagerInterface $em: une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param $id : id de l'utilisateur
     * @param JWTEncoderInterface $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request             $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/add/user/{id}', name: 'app_add_user')]
    public function register(EntityManagerInterface $em, $id = null, UserPasswordHasherInterface $passwordHasher, JWTEncoderInterface $jwtEncoder, Request $request, LogServices $LogServices)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$curuser) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        if ($id !== null) {
            $user = $em->getRepository(User::class)->findOneBy(['id' => $id]);
        }
        if ($user == null) {
            $user = new User();
        }

        // Vérification de l'existence de l'utilisateur
        if ($user->getEmail() !== null && $user->getEmail() !== $request->request->get('email')) {
            $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $request->request->get('email')]);
            if ($existingUser) {
                return new JsonResponse(['error' => 'Email already exists'], 400);
            }
        }

        $user->setEmail($request->request->get('email'));
        $user->setFirstname($request->request->get('firstname'));
        $user->setLastname($request->request->get('lastname'));

        if ($request->request->get('role') == 'ROLE_USER') {
            $user->setRoles(['ROLE_USER']);
        } elseif ($request->request->get('role') == 'ROLE_CREATOR') {
            $user->setRoles(['ROLE_USER', 'ROLE_CREATOR']);

            if ($user->getCreatorProfil() == null) {
                $creator = new CreatorProfil();
                $creator->setUser($user);
                $em->persist($creator);
            }
        } elseif ($request->request->get('role') == 'ROLE_ADMIN') {
            $user->setRoles(['ROLE_USER', 'ROLE_CREATOR', 'ROLE_ADMIN']);
        }

        if ($user->getCreatedAt() == null) {
            $user->setCreatedAt(new \DateTimeImmutable());
        } else {
            $user->setUpdatedAt(new \DateTimeImmutable());
        }

        if ($request->request->get('password') !== '') {
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $request->request->get('password')
            );
            $user->setPassword($hashedPassword);
        }

        $em->persist($user);
        $em->flush();

        $LogServices->createLog($curuser, $curuser->getEmail().' a ajouté l\'utilisateur ID : '.$user->getId(), 'USER');

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'User created successfully'], 201);
    }

    /**
     * Il s'agit d'une fonction qui permet d'envoyer un email à un utilisateur.
     *
     * @param entityManagerInterface $em: une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param $id : id de l'utilisateur
     * @param JWTEncoderInterface $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request             $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/user/send/email/{id}', name: 'app_send_email_user')]
    public function sendEmail(EntityManagerInterface $em, $id = null, UserPasswordHasherInterface $passwordHasher, JWTEncoderInterface $jwtEncoder, Request $request, LogServices $LogServices, EmailService $emailService)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$curuser) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $user = $em->getRepository(User::class)->findOneBy(['id' => $id]);

        $emailService->sendEmail(
            'emails/template.html.twig',
            [
                'firstName' => $user->getFirstName() ?? '',
                'lastName' => $user->getLastName() ?? '',
                'message' => $request->request->get('content'),
            ],
            $user->getEmail(),
            $request->request->get('object')
        );

        $LogServices->createLog($curuser, $curuser->getEmail().' a ajouté envoyé un mail à l\'utilisateur ID : '.$user->getId(), 'USER');

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'Email send successfully'], 201);
    }
}
