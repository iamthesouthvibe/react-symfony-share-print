<?php

namespace App\Controller;

use App\Entity\Campagne;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ShopController extends AbstractController
{
    /**
     * Il s'agit d'une fonction qui permet d'afficher la liste des produits (campagnes).
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/list/shop', name: 'app_shop')]
    public function index(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        // Get all campagnes
        $campagnes = $em->getRepository(Campagne::class)->findBy(['status' => 2], []);

        $data = [];

        foreach ($campagnes as $campagne) {
            $name = ($campagne->getUser()->getCreatorProfil() !== null) ? $campagne->getUser()->getCreatorProfil()->getDisplayName() : $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName();
            $createdAt = $campagne->getAcceptedAt()->format('Y-m-d');
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));

            $data[] = [
               'id' => $campagne->getId(),
               'userid' => $campagne->getUser()->getId(),
               'nameproject' => $campagne->getNameProject(),
               'fileSource' => $campagne->getFileSource().'.png',
               'name' => $name,
               'slug' => $campagne->getSlug(),
               'price' => $campagne->getPriceAti(),
               'paper' => $campagne->getPaper()->getName(),
               'size' => $campagne->getSize()->getName(),
               'weight' => $campagne->getWeight()->getWeight(),
               'days' => $days,
           ];
        }

        return new JsonResponse(['campagnes' => array_reverse($data)]);
    }

    /**
     * Il s'agit d'une fonction qui permet d'afficher le detail d'un produit (campagne).
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/shop/product/details/{slug}', name: 'app_shop_product_details')]
    public function productDetails(EntityManagerInterface $em, string $slug, Request $request): Response
    {
        if (!$slug) {
            return new JsonResponse(['error' => 'No slug'], 404);
        }
        // Get all campagnes
        $campagne = $em->getRepository(Campagne::class)->findOneBy(['slug' => $slug], []);

        if (!$campagne) {
            return new JsonResponse(['error' => 'Aucune campagne trouvé avec l\'ID : '], 404);
        }

        $createdAt = ($campagne->getCreatedAt() !== null) ? $campagne->getCreatedAt()->format('Y-m-d') : '';
        $today = date('Y-m-d');
        $diff = abs(strtotime($today) - strtotime($createdAt));
        $days = floor($diff / (60 * 60 * 24));
        $name = ($campagne->getUser()->getCreatorProfil() !== null) ? $campagne->getUser()->getCreatorProfil()->getDisplayName() : $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName();

        $campagnes = $campagne->getUser()->getCampagnes();

        $campagnes->removeElement($campagne);

        $campagnesData = [];
        foreach ($campagnes as $c) {
            $createdAt = ($c->getCreatedAt() !== null) ? $c->getCreatedAt()->format('Y-m-d') : '';
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));
            $campagnesData[] = [
                'id' => $c->getId(),
                'userid' => $c->getUser()->getId(),
                'nameproject' => $c->getNameProject(),
                'slug' => $c->getSlug(),
                'status' => $c->getStatus()->getLibelle(),
                'fileSource' => $c->getFileSource().'.png',
                'filename' => $c->getFileSource(),
                'price' => $c->getPriceAti(),
                'days' => $days,
            ];
        }
        // Filtrer les campagnes en fonction du statut
        $enCoursCampagnes = array_filter($campagnesData, function ($c) {
            return $c['status'] === 'En cours';
        });

        // Extraire les trois dernières campagnes filtrées
        $lastThreeCampagnes = array_slice(array_reverse($enCoursCampagnes), 0, 3);

        $data = [
            'id' => $campagne->getId(),
            'userid' => $campagne->getUser()->getId(),
            'name' => $name,
            'filename' => $campagne->getFileSource(),
            'nameproject' => $campagne->getNameProject(),
            'ncommande' => $campagne->getNumCommande(),
            'price' => $campagne->getPriceAti(),
            'description' => $campagne->getDescription(),
            'fileSource' => $campagne->getFileSource().'.png',
            'status' => $campagne->getStatus()->getLibelle(),
            'paper' => $campagne->getPaper()->getName(),
            'size' => $campagne->getSize()->getName(),
            'campagnes' => $lastThreeCampagnes,
            'weight' => $campagne->getWeight()->getWeight(),
            'bio' => $campagne->getUser()->getCreatorProfil()->getBio() ?? '',
            'instagram' => $campagne->getUser()->getCreatorProfil()->getInstagram() ?? '',
            'linkedin' => $campagne->getUser()->getCreatorProfil()->getLinkedin() ?? '',
            'dribble' => $campagne->getUser()->getCreatorProfil()->getDribble() ?? '',
            'behance' => $campagne->getUser()->getCreatorProfil()->getBehance() ?? '',
            'days' => $days,
        ];

        return new JsonResponse(['campagne' => $data]);
    }
}
