<?php

namespace App\Controller;

use App\Entity\Campagne;
use App\Entity\CampagneOrder;
use App\Entity\Order;
use App\Entity\User;
use App\Services\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Stripe\Product;
use Stripe\Stripe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class CardController extends AbstractController
{
    #[Route('/api/card/checkout', name: 'app_card_checkout')]
    public function checkout(Request $request, SessionInterface $session)
    {
        $data = json_decode($request->getContent(), true);

        if (count($data['cartItems']) < 1) {
            return new JsonResponse(['error' => 'Erreur, votre panier est vide'], 400);
        }

        // Initialisez Stripe avec les clés
        Stripe::setApiKey('sk_test_51LuG3LBECGZCUwAYsMyyQr9O86E7bX9ymy6U1vlUS31m4pIpZVs08eWenTXWGB3Be5cEu4FPmDG3YK6157NpXm69002Ioa9CIA');

        // Construction de la liste des items de la session
        $lineItems = [];
        foreach ($data['cartItems'] as $cartItem) {
            $lineItems[] = [
                'quantity' => $cartItem['quantity'],
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => $cartItem['price'] * 100, // Prix en centimes d'euro
                    'product_data' => [
                        'name' => $cartItem['name'],
                        'metadata' => [
                            'quantity' => $cartItem['quantity'],
                            'bonsoir' => 'bonsoir',
                            'idcampagne' => $cartItem['id'], // Ajouter l'ID du produit
                        ],
                    ],
                ],
            ];
        }

        // Création de la session de checkout Stripe
        $checkoutSession = Session::create([
            // 'shipping_address_collection' => ['allowed_countries' => ['FR', 'CA']],
            'shipping_options' => [
            [
                'shipping_rate_data' => [
                'type' => 'fixed_amount',
                'fixed_amount' => ['amount' => 650, 'currency' => 'EUR'],
                'display_name' => 'Colissimo',
                'delivery_estimate' => [
                    'minimum' => ['unit' => 'business_day', 'value' => 5],
                    'maximum' => ['unit' => 'business_day', 'value' => 7],
                ],
                ],
            ],
            ],
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'metadata' => [
                'firstname' => $data['customerData'][0],
                'lastname' => $data['customerData'][1],
                'country' => $data['customerData'][2],
                'address' => $data['customerData'][3],
                'zip' => $data['customerData'][4],
                'city' => $data['customerData'][5],
                'mobile' => $data['customerData'][6],
                'email' => $data['customerData'][7],
            ],
            'mode' => 'payment',
            'success_url' => 'http://127.0.0.1:8000/success_payment?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://127.0.0.1:8000/cancel',
        ]);

        // Sauvegarde de l'ID de la session de checkout en session Symfony
        $session = $request->getSession();
        $session->set('stripe_checkout_session_id', $checkoutSession->id);

        // Retourner une réponse JSON avec l'ID de la session de checkout
        return new JsonResponse(['checkout_session_id' => $checkoutSession->id]);
    }

    #[Route('/checkout/{checkoutSessionId}', name: 'app_checkout')]
    public function stripeCheckout(string $checkoutSessionId)
    {
        Stripe::setApiKey('sk_test_51LuG3LBECGZCUwAYsMyyQr9O86E7bX9ymy6U1vlUS31m4pIpZVs08eWenTXWGB3Be5cEu4FPmDG3YK6157NpXm69002Ioa9CIA');

        // Récupérer la session de checkout depuis l'ID
        $session = Session::retrieve($checkoutSessionId);

        // Rediriger l'utilisateur vers la page de paiement de Stripe
        return $this->redirect($session->url);
    }

    #[Route('/api/success_payment', name: 'app_success')]
    public function success(EntityManagerInterface $em, Request $request, SessionInterface $session, EmailService $emailService)
    {
        // Récupérer l'ID de la session de paiement dans l'URL de la requête
        $sessionId = $request->query->get('session_id');

        // Récupérer l'objet de session de paiement correspondant à partir de l'API Stripe
        Stripe::setApiKey('sk_test_51LuG3LBECGZCUwAYsMyyQr9O86E7bX9ymy6U1vlUS31m4pIpZVs08eWenTXWGB3Be5cEu4FPmDG3YK6157NpXm69002Ioa9CIA');
        $session = Session::retrieve($sessionId);

        // Vérifier si un objet Order existe pour l'ID de session de paiement
        $order = $em->getRepository(Order::class)->findOneBy(['sessionId' => $sessionId]);

        if (!$order) {
            // Vérifier l'état de paiement
            if ($session->payment_status === 'paid') {
                // Paiement réussi
                // Créer une nouvelle commande
                $order = new Order();

                $order->setCustomerFirstname($session->metadata->firstname);
                $order->setCustomerLastname($session->metadata->lastname);
                $order->setCustomerCountry($session->metadata->country);
                $order->setCustomerZip($session->metadata->zip);
                $order->setCustomerAddress($session->metadata->address);
                $order->setCustomerCity($session->metadata->city);
                $order->setCustomerEmail($session->metadata->email);
                $order->setCustomerMobile($session->metadata->mobile);
                $order->setCreatedAt(new \DateTimeImmutable());
                $order->setStatus($session->payment_status);
                $order->setSessionId($sessionId);
                $order->setIsPrint(false);
                $order->setIsSend(false);
                $order->setTotalPrice($session->amount_total / 100);

                $user = $em->getRepository(User::class)->findOneBy(['email' => $session->metadata->email]);
                if ($user) {
                    $order->setUser($user);
                }

                $em->persist($order);

                // Récupére toutes les commandes de la session
                $line_items = Session::allLineItems($sessionId);
                foreach ($line_items->data as $line_item) {
                    $productId = $line_item->price->product;
                    $product = Product::retrieve($productId);
                    $productName = $product->name;
                    $productMetadata = $product->metadata;

                    // Creation de campagneorder
                    $campagneOrder = new CampagneOrder();
                    $campagneOrder->setCampagne($em
                    ->getRepository(Campagne::class)
                    ->find($productMetadata->idcampagne));
                    $campagneOrder->setPurchase($order);
                    $campagneOrder->setQuantity($productMetadata->quantity);

                    $em->persist($campagneOrder);
                }

                $em->flush();

                $campagneOrders = $em->getRepository(CampagneOrder::class)->findBy(['purchase' => $order]);
                // Email
                $emailService->sendEmail(
                'emails/success-payment.html.twig',
                [
                    'name' => $session->metadata->firstname,
                    'campagneOrders' => $campagneOrders,
                    'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
                ],
                $session->metadata->email,
                'Merci pour votre commande !'
            );

                return new JsonResponse(['success' => 'Votre commande a été realisé avec succés'], 200);
            } else {
                $emailService->sendEmail(
                    'emails/success-payment.html.twig',
                    [
                        'name' => 'Paiement échoué ',
                        'campagneOrders' => '',
                        'createdAt' => $order->getCreatedAt()->format('Y-m-d'),
                    ],
                    $session->metadata->email,
                    'Merci pour votre commande !'
                );
                // Paiement échoué ou en attente
                return new JsonResponse(['error' => 'Paiement échoué ou en attente'], 404);
            }
        } else {
            return new JsonResponse(['error' => 'La session a expirée, vous allez etre redirigé vers la page d\'accueil'], 404);
        }
    }
}
