<?php

namespace App\Controller\Security;

use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'app_register')]
    public function register(ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher, Request $request): Response
    {
        $entityManager = $doctrine->getManager();

        // Vérification de l'existence de l'utilisateur
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('email')]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Email already exists'], 400);
        }

        if (empty($request->request->get('email')) && empty($request->request->get('email'))) {
            return new JsonResponse(['error' => 'Error'], 400);
        }

        // Création d'un nouvel utilisateur
        $user = new User();
        $user->setEmail($request->request->get('email'));
        $user->setRoles(['ROLE_USER']);
        $user->setCreatedAt(new \DateTimeImmutable());
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $request->request->get('password')
        );
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'User created successfully'], 201);
    }
}
