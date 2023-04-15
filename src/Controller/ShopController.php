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
    #[Route('/api/list/shop', name: 'app_shop')]
    public function index(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        // Get all campagnes
        $campagnes = $em->getRepository(Campagne::class)->findBy(['status' => 2], []);

        $data = [];

        foreach ($campagnes as $campagne) {
            $name = ($campagne->getUser()->getCreatorProfil() !== null) ? $campagne->getUser()->getCreatorProfil()->getDisplayName() : $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName();
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
           ];
        }

        return new JsonResponse(['campagnes' => array_reverse($data)]);
    }

    #[Route('/api/shop/product/details/{slug}', name: 'app_shop_product_details')]
    public function productDetails(EntityManagerInterface $em, string $slug, Request $request): Response
    {
        // Get all campagnes
        $campagne = $em->getRepository(Campagne::class)->findOneBy(['slug' => $slug], []);

        if (!$campagne) {
            return new JsonResponse(['error' => 'Aucune campagne trouvé avec l\'ID : '.$id]);
        }

        $createdAt = ($campagne->getCreatedAt() !== null) ? $campagne->getCreatedAt()->format('Y-m-d') : '';
        $today = date('Y-m-d');
        $diff = abs(strtotime($today) - strtotime($createdAt));
        $days = floor($diff / (60 * 60 * 24));
        $name = ($campagne->getUser()->getCreatorProfil() !== null) ? $campagne->getUser()->getCreatorProfil()->getDisplayName() : $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName();

        $campagnes = $campagne->getUser()->getCampagnes();

        $campagnesData = [];
        foreach ($campagnes as $c) {
            $campagnesData[] = [
                'id' => $c->getId(),
                'userid' => $c->getUser()->getId(),
                'nameproject' => $c->getNameProject(),
                'slug' => $c->getSlug(),
                'status' => $c->getStatus()->getLibelle(),
                'fileSource' => $c->getFileSource().'.png',
                'filename' => $c->getFileSource(),
                'price' => $c->getPriceAti(),
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
