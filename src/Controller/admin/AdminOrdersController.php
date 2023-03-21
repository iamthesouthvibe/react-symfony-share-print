<?php

namespace App\Controller\admin;

use App\Entity\Order;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Snappy\Pdf;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AdminOrdersController extends AbstractController
{
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
            $sendStatus = ($order->getIsSend() === false) ? 'À envoyer' : 'Envoyé';
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
                'send_status' => $sendStatus,
            ];
        }

        return new JsonResponse(['orders' => $data]);
    }

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

        $data = [
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
            'send_status' => $sendStatus,
        ];

        $CampagneOrders = $order->getCampagneOrders();

        $CampagneOrdersData = [];
        foreach ($CampagneOrders as $CampagneOrder) {
            $CampagneOrdersData[] = [
                'quantity' => $CampagneOrder->getQuantity(),
                'campagne_name' => $CampagneOrder->getCampagne()->getNameProject(),
                'campagne_price' => $CampagneOrder->getCampagne()->getPrice(),
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

    #[Route('/api/admin/order/print/', name: 'app_admin_print_order')]
    public function generatePrintPDF(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, Pdf $pdf)
    {
        $orders = $em->getRepository(Order::class)->findBy(['status' => 'paid', 'isSend' => false, 'isPrint' => false], ['id' => 'DESC']);

        $html = $this->renderView('emails/template_print_order.html.twig', [
            'orders' => $orders,
        ]);

        echo $html;
        exit;

        $pdfContent = $pdf->getOutputFromHtml($html);

        $response = new Response($pdfContent);
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', 'attachment; filename="your_file_name.pdf"');

        return $response;
    }
}
