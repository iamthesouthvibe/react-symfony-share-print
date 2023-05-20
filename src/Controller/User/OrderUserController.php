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
    /**
     * Il s'agit d'une fonction qui permet d'afficher la liste des commandes pour l'utilisateur connecté.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/order/list', name: 'app_order_list')]
    public function orderList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        /* DATA */
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'You should to be connect for see orders'], 401);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'You should to be connect for see orders'], 404);
        }

        $orders = $user->getOrders();

        $data = [];

        foreach ($orders as $order) {
            if ($order->getStatus() == 'paid') {
                $shipping = $order->getShippings()->last();

                if ($shipping) {
                    $shippingStatus = $shipping->getShippingStatus()->getLibelle();
                } else {
                    $shippingStatus = null;
                }
                $data[] = [
                        'id' => $order->getId(),
                        'status' => $order->getStatus(),
                        'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
                        'shipping_address' => $order->getCustomerAddress(),
                        'shipping_city' => $order->getCustomerCity(),
                        'shipping_country' => $order->getCustomerCountry(),
                        'shipping_zip' => $order->getCustomerZip(),
                        'total_price' => $order->getTotalPrice(),
                        'shipping' => $shippingStatus,
                    ];

                $CampagneOrders = $order->getCampagneOrders();

                $CampagneOrdersData = [];
                foreach ($CampagneOrders as $CampagneOrder) {
                    $CampagneOrdersData[] = [
                    'quantity' => $CampagneOrder->getQuantity(),
                    'campagne_name' => $CampagneOrder->getCampagne()->getNameProject(),
                    'campagne_price' => $CampagneOrder->getCampagne()->getPriceAti(),
                    'creatorId' => $CampagneOrder->getCampagne()->getUser()->getId(),
                    'campagne_filesource' => $CampagneOrder->getCampagne()->getFileSource().'.png',
                    'campagne_size' => $CampagneOrder->getCampagne()->getSize()->getName(),
                    'campagne_weight' => $CampagneOrder->getCampagne()->getWeight()->getWeight(),
                    'campagne_paper' => $CampagneOrder->getCampagne()->getPaper()->getName(),
                ];
                }
            }

            $data[count($data) - 1]['campagne_orders'] = $CampagneOrdersData;
        }

        return new JsonResponse(['orders' => array_reverse($data)]);
    }
}
