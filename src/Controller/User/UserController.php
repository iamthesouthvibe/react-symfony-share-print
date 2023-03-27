<?php

namespace App\Controller\User;

use App\Entity\Address;
use App\Entity\User;
use App\Services\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/api/user", name="app_user")
     * Cette fonction utilise la décoration de route pour mapper une demande HTTP GET à l'URL "/api/user" à cette fonction.
     * Il reçoit ensuite 3 paramètres d'injection de dépendance :
     *
     * @param EntityManagerInterface $em
     * @param JWTEncoderInterface    $jwtEncoder
     * @param Request                $request
     *                                           La fonction vérifie tout d'abord la validité du jeton en le décodant, et renvoie une réponse JSON contenant
     *                                           une erreur si le jeton est invalide. Sinon, elle utilise l'EntityManager et renvoie un tableau de données de l'utilisateur
     *
     * @return JsonResponse
     */
    #[Route('/api/user', name: 'app_user')]
    public function getCurrentUser(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $userData = [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'firstname' => $user->getFirstName() ?? '',
            'lastname' => $user->getLastName() ?? '',
        ];

        $address = $user->getAddress();
        if ($address) {
            $userData += [
                'address' => $address->getAddress() ?? '',
                'city' => $address->getCity() ?? '',
                'country' => $address->getCountry() ?? '',
                'zip' => $address->getZip() ?? '',
            ];
        }

        return new JsonResponse($userData);
    }

    /** Cette fonction utilise ensuite les données envoyées dans la requête pour mettre à jour les informations de profil de l'utilisateur,
     * puis enregistre les modifications en utilisant l'EntityManager et renvoie une réponse JSON de succès.
     *
     * @Route("/api/account/update", name="app_user_update")
     *
     * @param EntityManagerInterface $em
     * @param JWTEncoderInterface    $jwtEncoder
     * @param RequestStack           $requestStack
     *
     * @return JsonResponse
     */
    #[Route('/api/account/update', name: 'app_user_update')]
    public function updateUserProfie(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        /* TRAITEMENTS */
        try {
            $user->setEmail($request->request->get('email'));
            $user->setFirstName($request->request->get('firstname'));
            $user->setLastName($request->request->get('lastname'));

            $address = ($user->getAddress() !== null) ? $user->getAddress() : new Address();
            $address->setAddress($request->request->get('address'));
            $address->setCountry($request->request->get('country'));
            $address->setCity($request->request->get('city'));
            $address->setZip($request->request->get('zip'));

            $user->setAddress($address);
            $user->setUpdatedAt(new \DateTimeImmutable());
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Error form'], 401);
        }

        $em->persist($user);
        $em->persist($address);
        $em->flush();

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'User modified successfully'], 201);
    }

    /** Cette fonction utilise ensuite les données envoyées dans la requête pour mettre à jour le mot de passe de l'utilisateur,.
     * @Route("/api/account/change_password", name="app_user_change_password")
     *
     * @param EntityManagerInterface      $em
     * @param JWTEncoderInterface         $jwtEncoder
     * @param RequestStack                $requestStack
     * @param UserPasswordHasherInterface $passwordHasher
     *
     * @return JsonResponse
     */
    #[Route('/api/account/change_password', name: 'app_user_change_password')]
    public function UserProfieChangePassword(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, UserPasswordHasherInterface $passwordHasher, EmailService $emailService)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $request->request->get('password')
        );
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        $emailService->sendEmail(
            'emails/template.html.twig',
            [
                'firstName' => $user->getFirstName() ?? '',
                'lastName' => $user->getLastName() ?? '',
                'message' => 'Votre mot de passe a été modifié avec succés',
            ],
            $user->getEmail(),
            'Changement de mot de passe'
        );

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'Password modified successfully'], 201);
    }

    /** Cette fonction est utilisée pour récupérer le profil d'un créateur d'utilisateur. ,.
     * @Route("/api/account/creator/profile", name="app_creator_account")
     *
     * @param EntityManagerInterface $em
     * @param JWTEncoderInterface    $jwtEncoder
     * @param Request                $request
     *
     * @return JsonResponse
     */
    #[Route('/api/account/creator/profile', name: 'app_creator_account')]
    public function creatorProfile(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $creatorProfil = $user->getCreatorProfil();
        if (!$creatorProfil) {
            return new JsonResponse(['error' => 'Creator not found'], 404);
        }

        $userData = [
            'displayname' => $creatorProfil->getDisplayName() ?? '',
            'bio' => $creatorProfil->getBio() ?? '',
            'instagram' => $creatorProfil->getInstagram() ?? '',
            'linkedin' => $creatorProfil->getLinkedin() ?? '',
            'dribble' => $creatorProfil->getDribble() ?? '',
            'behance' => $creatorProfil->getBehance() ?? '',
            'payoutFirstname' => $creatorProfil->getPayoutFirstname() ?? '',
            'payoutLastname' => $creatorProfil->getPayoutLastname() ?? '',
            'payoutOrganisation' => $creatorProfil->getPayoutOrganisation() ?? '',
            'address' => $creatorProfil->getInvoiceAddress() ?? '',
            'city' => $creatorProfil->getInvoiceCity() ?? '',
            'country' => $creatorProfil->getInvoiceCountry() ?? '',
            'zip' => $creatorProfil->getInvoiceZip() ?? '',
            'paypalEmail' => $creatorProfil->getPaypalEmail() ?? '',
        ];

        return new JsonResponse($userData);
    }

    /** Cette fonction utilise ensuite les données envoyées dans la requête pour mettre à jour les informations de profil d'un créateur,
     * puis enregistre les modifications en utilisant l'EntityManager et renvoie une réponse JSON de succès.
     *
     * @Route("/api/account/creator/update", name="app_creator_update")
     *
     * @param EntityManagerInterface $em
     * @param JWTEncoderInterface    $jwtEncoder
     * @param RequestStack           $requestStack
     *
     * @return JsonResponse
     */
    #[Route('/api/account/creator/update', name: 'app_creator_update')]
    public function updateCreatorProfie(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $creatorProfil = $user->getCreatorProfil();
        if (!$creatorProfil) {
            return new JsonResponse(['error' => 'Creator not found'], 404);
        }

        /* TRAITEMENTS */
        try {
            $creatorProfil->setDisplayName($request->request->get('displayname'));
            $creatorProfil->setBio($request->request->get('bio'));
            $creatorProfil->setInstagram($request->request->get('instagram'));
            $creatorProfil->setLinkedin($request->request->get('linkedin'));
            $creatorProfil->setBehance($request->request->get('behance'));
            $creatorProfil->setDribble($request->request->get('dribble'));

            $creatorProfil->setUser($user);
            $user->setUpdatedAt(new \DateTimeImmutable());
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Error form'], 401);
        }

        $em->persist($creatorProfil);
        $em->flush();

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'Creator modified successfully'], 201);
    }

    /** Cette fonction utilise ensuite les données envoyées dans la requête pour mettre à jour les informations de settings d'un créateur,
     * puis enregistre les modifications en utilisant l'EntityManager et renvoie une réponse JSON de succès.
     *
     * @Route("/api/account/creator/settings/update", name="app_creator_settings_update"
     *
     * @param EntityManagerInterface $em
     * @param JWTEncoderInterface    $jwtEncoder
     * @param RequestStack           $requestStack
     *
     * @return JsonResponse
     */
    #[Route('/api/account/creator/settings/update', name: 'app_creator_settings_update')]
    public function updateCreatorSettings(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $creatorProfil = $user->getCreatorProfil();
        if (!$creatorProfil) {
            return new JsonResponse(['error' => 'Creator not found'], 404);
        }

        /* TRAITEMENTS */
        try {
            $creatorProfil->setPayoutFirstname($request->request->get('firstname'));
            $creatorProfil->setPayoutLastname($request->request->get('lastname'));
            $creatorProfil->setPayoutOrganisation($request->request->get('organisation'));
            $creatorProfil->setInvoiceAddress($request->request->get('address'));
            $creatorProfil->setInvoiceCity($request->request->get('city'));
            $creatorProfil->setInvoiceCountry($request->request->get('country'));
            $creatorProfil->setInvoiceZip($request->request->get('zip'));
            $creatorProfil->setPaypalEmail($request->request->get('paypalEmail'));

            $creatorProfil->setUser($user);
            $user->setUpdatedAt(new \DateTimeImmutable());
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Error form'], 401);
        }

        $em->persist($creatorProfil);
        $em->flush();

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'Creator settings modified successfully'], 201);
    }
}
