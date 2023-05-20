<?php

namespace App\Controller\admin;

use App\Entity\CampagneOrder;
use App\Entity\Order;
use App\Entity\Shipping;
use App\Entity\ShippingStatus;
use App\Entity\User;
use App\Services\EmailService;
use App\Services\PdfService;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

class AdminOrdersController extends AbstractController
{
    /**
     * Il s'agit d'une fonction qui renvoit la liste des commandes.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/order/list', name: 'app_order_admin_list')]
    public function orderList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        /* DATA */
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'You should to be connect for see orders'], 404);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'You should to be connect for see orders'], 404);
        }

        $orders = $em->getRepository(Order::class)->findAll();

        $data = [];

        foreach ($orders as $order) {
            $printStatus = ($order->getIsPrint() === false) ? 'À imprimer' : 'Imprimé';
            // $sendStatus = ($order->getIsSend() === false) ? 'À envoyer' : 'Envoyé';
            $lastShippingStatus = ($order->getShippings()->last() == true) ? $order->getShippings()->last()->getShippingStatus()->getLibelle() : 'À envoyer';
            $data[] = [
                'id' => $order->getId(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
                'shipping_address' => $order->getCustomerAddress(),
                'shipping_city' => $order->getCustomerCity(),
                'shipping_country' => $order->getCustomerCountry(),
                'shipping_zip' => $order->getCustomerZip(),
                'customer_name' => $order->getCustomerFirstname().' '.$order->getCustomerLastname(),
                'total_price' => $order->getTotalPrice(),
                'status' => $order->getStatus(),
                'print_status' => $printStatus,
                'send_status' => $lastShippingStatus,
            ];
        }

        return new JsonResponse(['orders' => $data]);
    }

    /**
     * Il s'agit d'une fonction qui renvoit le detail d'une commande.
     *
     * @param entityManagerInterface $em: une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param $id : id de la commande
     * @param JWTEncoderInterface $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request             $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/admin/order/detail/{id}', name: 'app_admin_details_order')]
    public function orderDetails(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $order = $em
            ->getRepository(Order::class)
            ->find($id);

        if (!$order) {
            return new JsonResponse(['error' => 'Aucune campagne trouvé avec l\'ID "%s".', $id]);
        }

        $printStatus = ($order->getIsPrint() === false) ? 'À imprimer' : 'Imprimé';
        $sendStatus = ($order->getIsSend() === false) ? 'À envoyer' : 'Envoyé';
        $lastShippingStatus = ($order->getShippings()->last() == true) ? $order->getShippings()->last()->getShippingStatus()->getLibelle() : 'À envoyer';

        $data = [
            'id' => $order->getId(),
            'customer_firstname' => $order->getCustomerFirstname(),
            'customer_lastname' => $order->getCustomerLastname(),
            'customer_email' => $order->getCustomerEmail(),
            'customer_mobile' => $order->getCustomerMobile(),
            'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
            'shipping_address' => $order->getCustomerAddress(),
            'shipping_city' => $order->getCustomerCity(),
            'shipping_country' => $order->getCustomerCountry(),
            'shipping_zip' => $order->getCustomerZip(),
            'total_price' => $order->getTotalPrice(),
            'priceHT' => $order->getPriceHt(),
            'delivery' => $order->getDeliveryPrice(),
            'tax' => $order->getTaxAmount(),
            'status' => $order->getStatus(),
            'print_status' => $printStatus,
            'send_status' => $lastShippingStatus,
        ];

        $CampagneOrders = $order->getCampagneOrders();

        $CampagneOrdersData = [];
        foreach ($CampagneOrders as $CampagneOrder) {
            $CampagneOrdersData[] = [
                'quantity' => $CampagneOrder->getQuantity(),
                'campagne_id' => $CampagneOrder->getCampagne()->getId(),
                'campagne_name' => $CampagneOrder->getCampagne()->getNameProject(),
                'campagne_price' => $CampagneOrder->getCampagne()->getPriceAti(),
                'creatorId' => $CampagneOrder->getCampagne()->getUser()->getId(),
                'campagne_filesource' => $CampagneOrder->getCampagne()->getFileSource().'.png',
                'campagne_size' => $CampagneOrder->getCampagne()->getSize()->getName(),
                'campagne_weight' => $CampagneOrder->getCampagne()->getWeight()->getWeight(),
                'campagne_paper' => $CampagneOrder->getCampagne()->getPaper()->getName(),
            ];
        }

        array_push($data, $CampagneOrdersData);

        return new JsonResponse(['order' => $data]);
    }

    /**
     * Il s'agit d'une fonction qui génére la liste des commandes à imprimer.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param PdfService             $pdf:        Service de PDF
     */
    #[Route('/api/admin/order/print', name: 'app_admin_print_order')]
    public function generatePrintPDF(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, PdfService $pdf)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $orders = $em->getRepository(Order::class)->findBy(['status' => 'paid', 'isSend' => false, 'isPrint' => false], ['id' => 'DESC']);

        $ordersList = $em->getRepository(Order::class)->findOrderByCampagneAndQuantity();

        $html = $this->renderView('pdf/template_print_order.html.twig', [
            'orders' => $orders,
            'ordersList' => $ordersList,
        ]);

        $date = date('Y-m-d'); // Récupération de la date du jour au format "année-mois-jour"
        $unique_id = uniqid(); // Génération d'un identifiant unique
        $unique_id = substr($unique_id, -5); // Récupération des 5 derniers caractères de l'identifiant unique

        $filename = $date.'_'.$unique_id.'.pdf';
        $response = $pdf->showPdfFile($html, $filename);

        $pdf->savePdfFile($html, $this->getParameter('print_dir'), $filename);

        return new Response($response, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $filename),
        ]);
    }

    /**
     * Il s'agit d'une fonction qui change le statut d'impression d'une commande.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param $id : id de la commande
     */
    #[Route('/api/admin/order/printstatus/{id}', name: 'app_print_status_campagne')]
    public function changePrintStatus(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        // LogServices $logServices
        $order = $em
            ->getRepository(Order::class)
            ->find($id);

        if (!$order) {
            return new JsonResponse(['error' => sprintf('Aucune commande trouvée avec l\'ID "%s".', $id)], 404);
        }

        $order->setPrintAt(new \DateTimeImmutable());
        $order->setIsPrint(true);
        $em->persist($order);
        $em->flush();

        // $logServices->createCampagneLog($campagne, 'Campagne refusée', 'CAMPAGNE_REJECT');

        return new JsonResponse(['success' => 'La commande a été noté comme imprimé']);
    }

    /**
     * Il s'agit d'une fonction qui génére la liste des commandes à envoyer.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param PdfService             $pdf:        Service de PDF
     */
    #[Route('/api/admin/print/delivery', name: 'app_admin_print_delivery')]
    public function exportOrders(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $orders = $em->getRepository(Order::class)->findBy(['status' => 'paid', 'isSend' => false, 'isPrint' => true], ['id' => 'DESC']);
        $pdfs = [];

        if (!empty($orders)) {
            // boucle sur les commandes et crée un PDF pour chaque commande
            foreach ($orders as $order) {
                $html = $this->renderView('pdf/template_print_order_resume.html.twig', [
                'order' => $order,
            ]);

                $pdf = new Dompdf();
                $options = $pdf->getOptions();
                $options->setIsRemoteEnabled(true);
                $pdf->setOptions($options);

                $pdf->loadHtml($html);
                $pdf->setPaper('A4', 'portrait');
                $pdf->render();
                $pdfs[$order->getId()] = $pdf->output();
            }

            // crée un zip contenant tous les PDF
            $zip = new \ZipArchive();
            $zipName = 'resumeOrder-'.date('Y-m-d-H-i-s').'.zip';
            // $zipPath = sys_get_temp_dir().'/'.$zipName;
            $zipPath = $this->getParameter('kernel.project_dir').'/public/pdf/resumeOrder/'.$zipName;

            if ($zip->open($zipPath, \ZipArchive::CREATE) !== true) {
                throw new \RuntimeException('Impossible de créer le fichier zip');
            }

            foreach ($pdfs as $orderId => $pdfContent) {
                $fileName = "order_$orderId.pdf";
                $zip->addFromString($fileName, $pdfContent);
            }

            $zip->close();

            // envoie la réponse avec le zip pour téléchargement
            $response = new Response(file_get_contents($zipPath));
            $response->headers->set('Content-Type', 'application/zip');
            $response->headers->set('Content-Disposition', $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $zipName
        ));

            return $response;
        } else {
            return new JsonResponse(['error' => 'Aucune commande à expédié'], 404);
        }
    }

    /**
     * Il s'agit d'une fonction qui change le statut d'envoi d'une commande.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param $id : id de la commande
     */
    #[Route('/api/admin/order/shippingstatus/{id}', name: 'app_shipping_status_campagne')]
    public function changeShippingStatus(EntityManagerInterface $em, $id, JWTEncoderInterface $jwtEncoder, Request $request, EmailService $emailService)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $order = $em
            ->getRepository(Order::class)
            ->find($id);

        if (!$order) {
            return new JsonResponse(['error' => sprintf('Aucune commande trouvée avec l\'ID "%s".', $id)], 404);
        }

        if ($order->getSendAt() == null || $order->getShipCode() == null) {
            $shipping = new Shipping();
            $shippingStatus = $em->getRepository(ShippingStatus::class)->findOneBy(['code' => 'DR1']);

            $shipping->setPurchase($order);
            $shipping->setDate(new \DateTimeImmutable());
            $shipping->setShippingStatus($shippingStatus);

            $codeShipping = $request->request->get('idshipping');

            $order->setShipCode($codeShipping);
            $order->setSendAt(new \DateTimeImmutable());

            $order->setIsSend(true);
            $em->persist($order);
            $em->persist($shipping);
            $em->flush();

            $campagneOrders = $em->getRepository(CampagneOrder::class)->findBy(['purchase' => $order]);

            $emailService->sendEmail(
                'emails/order-deposit.html.twig',
                [
                    'name' => $order->getCustomerFirstname().' '.$order->getCustomerLastname() ?? '',
                    'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
                    'campagneOrders' => $campagneOrders,
                ],
                $order->getCustomerEmail(),
                'Your order is on its way!'
            );
            // $logServices->createCampagneLog($campagne, 'Campagne refusée', 'CAMPAGNE_REJECT');

            return new JsonResponse(['success' => 'La commande a été noté comme envoyé']);
        } else {
            return new JsonResponse(['error' => 'La commande a deja été noté comme envoyé'], 404);
        }
    }

    #[Route('/api/admin/shipping/list', name: 'app_shipping_admin_list')]
    public function shippingList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        /* DATA */
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'You should to be connect for see orders'], 404);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'You should to be connect for see orders'], 404);
        }

        $shippings = $em->getRepository(ShippingStatus::class)->findAll();

        $data = [];

        foreach ($shippings as $key => $shipping) {
            $data[] = [
                'code' => $shipping->getCode(),
               'libelle' => $shipping->getLibelle(),
            ];
        }

        return new JsonResponse(['shippings' => $data]);
    }
}
