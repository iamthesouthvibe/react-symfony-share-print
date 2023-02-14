<?php

namespace App\Controller\Security;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use App\Entity\User;


class LoginController extends AbstractController
{

    #[Route('/api/login', name: 'app_login')]
    public function login(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $encoder, JWTTokenManagerInterface $JWTManager, JWTEncoderInterface $JWTEncoder)
    {
        $entityManager = $doctrine->getManager();
        // $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('email')]);
        if (!$user) {
            return new JsonResponse(['error' => 'Email is wrong' . $request->request->get('email')], 400);
        }

        if (!$encoder->isPasswordValid($user, $request->request->get('password'))) {
            return new JsonResponse(['error' => 'Password is wrong'], 400);
        }

        $token = $JWTEncoder->encode([
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600 // 1 hour expiration
        ]);

        return new JsonResponse(['token' => $token]);
    }
}