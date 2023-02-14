<?php

namespace App\Controller\admin;

use App\Entity\Campagne;
use App\Entity\CampagneStatus;
use App\Entity\Product;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class AdminCampagneController extends AbstractController
{
    #[Route('/api/list/campagnes', name: 'app_list_campagnes')]
    public function getCampagnesList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        // Get all campagnes
        $campagnes = $em->getRepository(Campagne::class)->findAll();

        $data = [];

        foreach ($campagnes as $campagne) {
            $createdAt = ($campagne->getCreatedAt() !== null) ? $campagne->getCreatedAt()->format('Y-m-d') : '';
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));

            $data[] = [
               'id' => $campagne->getId(),
               'userid' => $campagne->getUser()->getId(),
               'name' => $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName(),
               'filename' => $campagne->getFileSource(),
               'nameproject' => $campagne->getNameProject(),
               'ncommande' => $campagne->getNumCommande(),
               'price' => $campagne->getPrice(),
               'days' => $days,
               'fileSource' => $this->getParameter('campagnes_dir').'/'.$campagne->getUser()->getId().'/'.$campagne->getFileSource().'.pdf',
               'status' => $campagne->getStatus()->getLibelle(),
               'createdAt' => $createdAt,
           ];
        }

        return new JsonResponse(['campagnes' => array_reverse($data)]);
    }

    /**
     * downloadCampagneFile function
     * Télécharge le pdf d'une campagne.
     */
    #[Route('/api/admin/campagne/download/{id}', name: 'app_admin_campagne_download')]
    public function downloadCampagneFile(EntityManagerInterface $em, Request $request, string $id, JWTEncoderInterface $jwtEncoder)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        /** DATA */
        $campagne = $em->getRepository(Campagne::class)->findOneBy(['id' => $id], []);

        $file = $this->getParameter('campagnes_dir').'/'.$campagne->getUser()->getId().'/'.$campagne->getFileSource().'.pdf';

        try {
            if (!$file) {
                $array = [
                    'status' => 0,
                    'message' => 'File does not exist',
                ];
                $response = new JsonResponse($array, 200);

                return $response;
            }

            $response = new BinaryFileResponse($file);
            $response->headers->set('Content-Type', 'application/pdf');
            $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, $campagne->getFileSource().'.pdf');

            return $response;
        } catch (Exception $e) {
            $array = [
                'status' => 0,
                'message' => 'Download error',
            ];
            $response = new JsonResponse($array, 400);

            return $response;
        }
    }

    #[Route('/api/campagne/detail/{id}', name: 'app_details_campagne')]
    public function details(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $campagne = $em
            ->getRepository(Campagne::class)
            ->find($id);

        if (!$campagne) {
            return new JsonResponse(['error' => 'Aucun utilisateur trouvé avec l\'ID "%s".', $id]);
        }

        $createdAt = ($campagne->getCreatedAt() !== null) ? $campagne->getCreatedAt()->format('Y-m-d') : '';
        $today = date('Y-m-d');
        $diff = abs(strtotime($today) - strtotime($createdAt));
        $days = floor($diff / (60 * 60 * 24));
        $data = [
            'id' => $campagne->getId(),
            'userid' => $campagne->getUser()->getId(),
            'name' => $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName(),
            'filename' => $campagne->getFileSource(),
            'nameproject' => $campagne->getNameProject(),
            'ncommande' => $campagne->getNumCommande(),
            'price' => $campagne->getPrice(),
            'fileSource' => $campagne->getFileSource().'.png',
            'status' => $campagne->getStatus()->getLibelle(),
            'paper' => $campagne->getPaper()->getName(),
            'size' => $campagne->getSize()->getName(),
            'weight' => $campagne->getWeight()->getWeight(),
            'payoutfirstname' => $campagne->getUser()->getCreatorProfil()->getPayoutFirstname() ?? '',
            'payoutlastname' => $campagne->getUser()->getCreatorProfil()->getPayoutLastName() ?? '',
            'paypalemail' => $campagne->getUser()->getCreatorProfil()->getPaypalEmail() ?? '',
            'createdAt' => $createdAt,
            'days' => $days,
        ];

        return new JsonResponse($data);
    }

    #[Route('/api/admin/campagne/accept/{id}', name: 'app_accept_campagne')]
    public function AcceptCampagneAndCreateProduct(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request, SluggerInterface $slugger)
    {
        $campagne = $em
            ->getRepository(Campagne::class)
            ->find($id);

        if (!$campagne) {
            return new JsonResponse(['error' => 'Aucun utilisateur trouvé avec l\'ID "%s".', $id]);
        }

        $campagneStatus = $em->getRepository(CampagneStatus::class)->findOneBy(['id' => 2], []);

        /* TRAITEMENTS */
        // On envoie le status validé à la campagne
        $campagne->setStatus($campagneStatus);

        $em->persist($campagne);

        if ($campagne->getProduct() == null) {
            // On crée le produit
            $product = new Product();

            $product->setCampagne($campagne);
            $product->setIsBest(0);
            $product->setIsNew(1);

            $slug = $slugger->slug($campagne->getNameProject());
            while (true) {
                $slugDoublon = $em->getRepository(Product::class)->findBy(['slug' => $slug], []);
                if (count($slugDoublon) === 0) {
                    break;
                }
                $slug = $slug.'-'.count($slugDoublon) + 1;
            }

            $product->setSlug($slug);
            $product->setCreatedAt();
            $em->persist($product);

            $em->flush();

            // Send email to creator

            // Log
        }

        return new JsonResponse(['success' => 'Campagne accepté et produit créer avec succés']);
    }
}
