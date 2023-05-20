<?php

namespace App\Controller\Security;

use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{
    /**
     * Il s'agit d'une fonction qui permet d'identifier un utilisateur.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/login', name: 'app_login')]
    public function login(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $encoder, JWTTokenManagerInterface $JWTManager, JWTEncoderInterface $JWTEncoder)
    {
        $entityManager = $doctrine->getManager();
        // $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('email')]);
        if (!$user) {
            return new JsonResponse(['error' => 'Email is wrong'.$request->request->get('email')], 400);
        }

        if (!$encoder->isPasswordValid($user, $request->request->get('password'))) {
            return new JsonResponse(['error' => 'Password is wrong'], 400);
        }

        $token = $JWTEncoder->encode([
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // 1 hour expiration
        ]);

        return new JsonResponse(['token' => $token], 200);
    }
}
