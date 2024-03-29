<?php

namespace App\Controller\admin;

use App\Entity\Campagne;
use App\Entity\CampagneStatus;
use App\Entity\User;
use App\Services\EmailService;
use App\Services\LogServices;
use App\Services\PaypalTransferService;
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
    /**
     * Il s'agit d'une fonction qui renvoit la liste des campagnes.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/list/campagnes', name: 'app_list_campagnes')]
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
        $dataLogs = [];

        foreach ($campagnes as $campagne) {
            $createdAt = ($campagne->getCreatedAt() !== null) ? $campagne->getCreatedAt()->format('Y-m-d') : '';
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));

            $acceptedAt = ($campagne->getAcceptedAt() !== null) ? $campagne->getAcceptedAt()->format('Y-m-d') : '';
            $rejectAt = ($campagne->getRejectAt() !== null) ? $campagne->getRejectAt()->format('Y-m-d') : '';

            $data[] = [
               'id' => $campagne->getId(),
               'roles' => $campagne->getUser()->getRoles(),
               'userid' => $campagne->getUser()->getId(),
               'name' => $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName(),
               'filename' => $campagne->getFileSource(),
               'nameproject' => $campagne->getNameProject(),
               'ncommande' => $campagne->getNumCommande(),
               'price' => $campagne->getPrice(),
               'priceAti' => $campagne->getPriceAti(),
               'pricePrint' => $campagne->getPricePrint(),
               'totalTax' => $campagne->getTotalTax(),
               'paper' => $campagne->getPaper()->getName(),
               'size' => $campagne->getSize()->getName(),
               'weight' => $campagne->getWeight()->getWeight(),
               'days' => $days,
               'acceptedAt' => $acceptedAt,
               'rejectAt' => $rejectAt,
               'fileSource' => $this->getParameter('campagnes_dir').'/'.$campagne->getUser()->getId().'/'.$campagne->getFileSource().'.pdf',
               'filename' => $campagne->getFileSource().'.pdf',
               'status' => $campagne->getStatus()->getLibelle(),
               'createdAt' => $createdAt,
           ];

            $campagneLogs = $campagne->getCampagneLogs();
            if ($campagneLogs !== null) {
                foreach ($campagneLogs as $campagneLog) {
                    $dataLogs[] = [
                    'campagneid' => $campagneLog->getCampagne()->getId(),
                    'logId' => $campagneLog->getId(),
                    'message' => $campagneLog->getMessage(),
                    'code' => $campagneLog->getCode(),
                ];
                }
            }
        }

        return new JsonResponse(['campagnes' => array_reverse($data), 'logs' => array_reverse($dataLogs)]);
    }

    /**
     * downloadCampagneFile function
     * Télécharge le pdf d'une campagne.
     *
     * @param entityManagerInterface $em:          une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder:  une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:     une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param string                 $id           : id de la campagne
     * @param LogServices            $LogServices: une instance de la LogServicesclasse, utilisée pour la journalisation
     */
    #[Route('/api/admin/campagne/download/{id}', name: 'app_admin_campagne_download')]
    public function downloadCampagneFile(EntityManagerInterface $em, Request $request, string $id, JWTEncoderInterface $jwtEncoder, LogServices $logServices)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

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

            $logServices->createCampagneLog($campagne, 'Le fichier source de la campagne a été téléchargé par l\'utlisateur : '.$curuser->getid(), 'CAMPAGNE_DOWNLOAD');

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

    /**
     * Il s'agit d'une fonction qui affiche le détail d'une campagne.
     *
     * @param entityManagerInterface $em:      une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param                        $id:      id de la campagne
     * @param request                $request: une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/campagne/detail/{id}', name: 'app_details_campagne')]
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
            return new JsonResponse(['error' => 'Aucune campagne trouvé avec l\'ID "%s".', $id]);
        }

        $nbvente = 0;
        foreach ($campagne->getCampagneOrders() as $key => $campagneOrder) {
            if ($campagneOrder->getPurchase()->getStatus() == 'paid') {
                $nbvente = $campagneOrder->getQuantity() + $nbvente;
            }
        }

        if ($campagne->getAcceptedAt()) {
            $createdAt = $campagne->getAcceptedAt()->format('Y-m-d');
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));
        }

        $data = [
            'id' => $campagne->getId(),
            'userid' => $campagne->getUser()->getId(),
            'name' => $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName(),
            'filename' => $campagne->getFileSource(),
            'nameproject' => $campagne->getNameProject(),
            'ncommande' => $campagne->getNumCommande(),
            'price' => $campagne->getPrice(),
            'priceAti' => $campagne->getPriceAti(),
            'pricePrint' => $campagne->getPricePrint(),
            'totalTax' => $campagne->getTotalTax(),
            'fileSource' => $campagne->getFileSource().'.png',
            'status' => $campagne->getStatus()->getLibelle(),
            'paper' => $campagne->getPaper()->getName(),
            'size' => $campagne->getSize()->getName(),
            'weight' => $campagne->getWeight()->getWeight(),
            'payoutfirstname' => $campagne->getUser()->getCreatorProfil()->getPayoutFirstname() ?? '',
            'payoutlastname' => $campagne->getUser()->getCreatorProfil()->getPayoutLastName() ?? '',
            'paypalemail' => $campagne->getUser()->getCreatorProfil()->getPaypalEmail() ?? '',
            'createdAt' => $createdAt ?? null,
            'days' => $days ?? null,
            'description' => $campagne->getDescription(),
            'nbvente' => $nbvente,
            'ca' => $campagne->getTotalCa() ?? 0,
            'benefCreator' => $campagne->getTotalBenefCreator() ?? 0,
            'benefCompany' => $campagne->getTotalBenefCompany() ?? 0,
            'totaltax' => $campagne->getTotalTaxamount(),
        ];

        return new JsonResponse($data);
    }

    /**
     * Il s'agit d'une fonction qui permet d'accepter la campagne.
     *
     * @param entityManagerInterface $em:      une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param                        $id:      id de la campagne
     * @param request                $request: une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/campagne/accept/{id}', name: 'app_accept_campagne')]
    public function acceptCampagne(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request, SluggerInterface $slugger, LogServices $logServices, EmailService $emailService)
    {
        $campagne = $em
            ->getRepository(Campagne::class)
            ->find($id);

        if (!$campagne) {
            return new JsonResponse(['error' => 'Aucune campagne trouvé avec l\'ID "%s".', $id]);
        }

        $campagneStatus = $em->getRepository(CampagneStatus::class)->findOneBy(['id' => 2], []);

        if ($campagne->getRejectAt() !== null) {
            return new JsonResponse(['error' => 'Erreur, Impossible de valider la campagne, la campagne a déjà été réfusé'], 400);
        }

        /* TRAITEMENTS */
        // On envoie le status validé à la campagne
        $campagne->setStatus($campagneStatus);
        $slug = $slugger->slug($campagne->getNameProject());
        while (true) {
            $slugDoublon = $em->getRepository(Campagne::class)->findBy(['slug' => $slug], []);
            if (count($slugDoublon) === 0) {
                break;
            }
            $slug = $slug.'-'.count($slugDoublon) + 1;
        }
        $campagne->setAcceptedAt(new \DateTimeImmutable());
        $campagne->setSlug($slug);
        $em->persist($campagne);
        $em->flush();

        $logServices->createCampagneLog($campagne, 'Campagne accepté', 'CAMPAGNE_CREATE');

        $emailService->sendEmail(
            'emails/campagn-accepted.html.twig',
            [
                'campagne' => $campagne,
            ],
            $campagne->getUser()->getEmail(),
            'Your campaign has been successfully accepted!'
        );

        return new JsonResponse(['success' => 'Campagne accepté avec succés']);
    }

    /**
     * Il s'agit d'une fonction qui permet de refuser la campagne.
     *
     * @param entityManagerInterface $em:      une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param                        $id:      id de la campagne
     * @param request                $request: une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/campagne/reject/{id}', name: 'app_reject_campagne')]
    public function rejectCampagne(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request, LogServices $logServices, EmailService $emailService)
    {
        $campagne = $em
            ->getRepository(Campagne::class)
            ->find($id);

        if (!$campagne) {
            return new JsonResponse(['error' => sprintf('Aucune campagne trouvée avec l\'ID "%s".', $id)], 404);
        }

        if ($campagne->getAcceptedAt() !== null) {
            return new JsonResponse(['error' => 'Erreur, impossible de refuser, la campagne a déjà été acceptée et est en cours'], 400);
        }

        $campagneStatus = $em->getRepository(CampagneStatus::class)->findOneBy(['id' => 6], []);
        $campagne->setRejectAt(new \DateTimeImmutable());
        $campagne->setStatus($campagneStatus);
        $em->persist($campagne);
        $em->flush();

        $logServices->createCampagneLog($campagne, 'Campagne refusée', 'CAMPAGNE_REJECT');

        $emailService->sendEmail(
            'emails/campagn-rejected.html.twig',
            [
                'campagne' => $campagne,
            ],
            $campagne->getUser()->getEmail(),
            'Your campaign has been declined'
        );

        return new JsonResponse(['success' => 'Campagne refusée avec succès']);
    }

    #[Route('/api/admin/campagne/transfer', name: 'app_transfer_campagne')]
    public function transfer(PaypalTransferService $paypalTransferService, Request $request): Response
    {
        // Récupérer les informations de paiement du formulaire
        $amount = $request->get('amount');
        $currency = $request->get('currency');
        $recipientEmail = $request->get('recipient_email');

        // Transférer l'argent avec le service PaypalTransferService
        $result = $paypalTransferService->transfer(10, 'EUR', 'test@test.fr');

        // Afficher le résultat
        if ($result) {
            return $this->redirectToRoute('success');
        } else {
            return $this->redirectToRoute('error');
        }
    }
}
