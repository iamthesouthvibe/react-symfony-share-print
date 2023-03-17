<?php

namespace App\Controller\admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
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

        $orders = $user->getOrders();

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
                'print_status' => $printStatus,
                'send_status' => $sendStatus,
            ];
        }

        return new JsonResponse(['orders' => $data]);
    }
}
