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
                'message' => 'Cliquez sur le lien suivant pour réinitialiser votre mot de passe : '.$url,
            ],
            $user->getEmail(),
            'Réinitialisation de mot de passe'
        );

        // Retourner une réponse JSON avec un message de succès
        return new JsonResponse(['message' => 'Un email a été envoyé à votre adresse avec des instructions pour réinitialiser votre mot de passe.']);
    }

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
