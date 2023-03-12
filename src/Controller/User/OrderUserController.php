<?php

namespace App\Controller\User;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class OrderUserController extends AbstractController
{
    #[Route('/api/order/list', name: 'app_order_list')]
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
            $data[] = [
                'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
                'shipping_address' => $order->getCustomerAddress(),
                'shipping_city' => $order->getCustomerCity(),
                'shipping_country' => $order->getCustomerCountry(),
                'shipping_zip' => $order->getCustomerZip(),
                'total_price' => $order->getTotalPrice(),
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

            $data[count($data) - 1]['campagne_orders'] = $CampagneOrdersData;
        }

        return new JsonResponse(['orders' => $data]);
    }
}
