<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class ResetPasswordController extends AbstractController
{
    /**
     * Il s'agit d'une fonction qui permet d'envoyer un lien de reinitialisation de mdp et stock un resetToken dans la database.
     *
     * @param entityManagerInterface $em:          une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder:  une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:     une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param EmailService           $emailService : Service d'envoi de mail
     */
    #[Route('/api/requestpassword', name: 'app_requestpassword')]
    public function request(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, EmailService $emailService): Response
    {
        $email = $request->request->get('email');

        // Trouver l'utilisateur correspondant dans la base de données
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            // Si l'utilisateur n'existe pas, retourner une erreur 404
            return new JsonResponse(['message' => 'Utilisateur introuvable.'], 404);
        }

        // Générer un token aléatoire
        $token = bin2hex(random_bytes(32));

        // Stocker le token avec l'utilisateur correspondant dans la base de données
        $user->setResetToken($token);
        $em->persist($user);
        $em->flush();

        $url = sprintf('http://127.0.0.1:8000/reset-password/%s', $token);

        $emailService->sendEmail(
            'emails/template.html.twig',
            [
                'firstName' => '',
                'lastName' => '',
                'message' => 'Click on the following link to reset your password: '.$url,
            ],
            $user->getEmail(),
            'Réinitialisation de mot de passe'
        );

        // Retourner une réponse JSON avec un message de succès
        return new JsonResponse(['message' => 'An email has been sent to your address with instructions to reset your password.']);
    }

    /**
     * Il s'agit d'une fonction qui permet de traiter le formulaire de reinitialisation de mdp.
     *
     * @param entityManagerInterface $em:          une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder:  une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:     une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param EmailService           $emailService : Service d'envoi de mail
     */
    #[Route('/api/resetpassword/{token}', name: 'app_resetpassword')]
    public function reset(EntityManagerInterface $em, Request $request, UserPasswordHasherInterface $passwordHasher, EmailService $emailService)
    {
        // Récupérer le token et le nouveau mot de passe fournis dans la requête
        $token = $request->get('token');

        // Trouver l'utilisateur correspondant dans la base de données
        $user = $em->getRepository(User::class)->findOneBy(['resetToken' => $token]);

        if (!$user) {
            // Si l'utilisateur n'existe pas, retourner une erreur 404
            return new JsonResponse(['message' => 'Utilisateur introuvable.'], 404);
        }

        if ($request->request->get('password') !== '') {
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $request->request->get('password')
            );
            $user->setPassword($hashedPassword);
        }

        $user->setResetToken(null);
        $em->persist($user);
        $em->flush();

        $emailService->sendEmail(
            'emails/template.html.twig',
            [
                'firstName' => '',
                'lastName' => '',
                'message' => 'Votre mot de passe a bien été réinitialiser ',
            ],
            $user->getEmail(),
            'Réinitialisation de mot de passe réussi'
        );

        // Retourner une réponse JSON avec un message de succès
        return new JsonResponse(['message' => 'Le mot de passe a été réinitialisé avec succès.']);
    }
}
