<?php

namespace App\Controller;

use App\Entity\Campagne;
use App\Entity\CampagneOrder;
use App\Entity\Order;
use App\Entity\User;
use App\Services\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class CardController extends AbstractController
{
    /**
     * Traiter une demande de paiement d'un panier. Elle utilise la bibliothèque Stripe
     * pour créer une session de paiement et initier le processus de paiement,
     * et crée ainsi la commande dans la db.
     *
     * @param : Request $request: l'objet Request contenant les données de la demande HTTP
     * @param : SessionInterface $session: l'interface Session de Symfony pour stocker des variables de session
     * @param : EntityManagerInterface $em: l'interface de gestionnaire d'entité pour interagir avec la base de données
     */
    #[Route('/api/card/checkout', name: 'app_card_checkout')]
    public function checkout(Request $request, SessionInterface $session, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);

        if (count($data['cartItems']) < 1) {
            return new JsonResponse(['error' => 'Erreur, votre panier est vide'], 400);
        }

        // Initialisez Stripe avec les clés
        Stripe::setApiKey('sk_test_51LuG3LBECGZCUwAYsMyyQr9O86E7bX9ymy6U1vlUS31m4pIpZVs08eWenTXWGB3Be5cEu4FPmDG3YK6157NpXm69002Ioa9CIA');

        // Crée la commande ici avec status à null et stocker checkoutSession id
        $order = new Order();
        $order->setCustomerFirstname($data['customerData'][0]);
        $order->setCustomerLastname($data['customerData'][1]);
        $order->setCustomerCountry($data['customerData'][2]);
        $order->setCustomerAddress($data['customerData'][4]);
        $order->setCustomerZip($data['customerData'][4]);
        $order->setCustomerCity($data['customerData'][5]);
        $order->setCustomerMobile($data['customerData'][6]);
        $order->setCustomerEmail($data['customerData'][7]);
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setIsPrint(false);
        $order->setIsSend(false);
        $order->setTotalPrice($data['totalPrice'] + 6.50);
        $order->setDeliveryPrice(6.50);

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['customerData'][7]]);
        if ($user) {
            $order->setUser($user);
        }

        // Construction de la liste des items de la session
        $lineItems = [];
        $totalTax = 0;
        $priceHt = 0;
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
            // Créer les campagnes orders ici
            $campagneExist = $em->getRepository(Campagne::class)->find($cartItem['id']);
            $campagneOrder = new CampagneOrder();
            $campagneOrder->setCampagne($campagneExist);
            $campagneOrder->setPurchase($order);
            $campagneOrder->setQuantity($cartItem['quantity']);

            $totalTax = $campagneExist->getTotalTax() + $totalTax;
            $totalTax = $totalTax * $cartItem['quantity'];

            $priceHt = $campagneExist->getPrice() + $priceHt;
            $priceHt = $priceHt * $cartItem['quantity'];

            $em->persist($campagneOrder);
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
                    'maximum' => ['unit' => 'business_day', 'value' => 10],
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

        $order->setSessionId($checkoutSession->id);
        $order->setTaxAmount($totalTax);
        $order->setPriceHt($priceHt);

        $em->persist($order);
        $em->flush();

        // Retourner une réponse JSON avec l'ID de la session de checkout
        return new JsonResponse(['checkout_session_id' => $checkoutSession->id]);
    }

    /**
     *  la méthode utilise la clé secrète de l'API Stripe pour récupérer la session de paiement
     *  à partir de l'identifiant $checkoutSessionId. Enfin, elle redirige l'utilisateur vers la page
     *  de paiement de Stripe en utilisant l'URL de la session récupérée.
     *
     * @param : string $checkoutSessionId correspond à l'identifiant de la session de paiement créée auparavant par Stripe
     */
    #[Route('/checkout/{checkoutSessionId}', name: 'app_checkout')]
    public function stripeCheckout(string $checkoutSessionId)
    {
        Stripe::setApiKey('sk_test_51LuG3LBECGZCUwAYsMyyQr9O86E7bX9ymy6U1vlUS31m4pIpZVs08eWenTXWGB3Be5cEu4FPmDG3YK6157NpXm69002Ioa9CIA');

        // Récupérer la session de checkout depuis l'ID
        $session = Session::retrieve($checkoutSessionId);

        // Rediriger l'utilisateur vers la page de paiement de Stripe
        return $this->redirect($session->url);
    }

    /**
     * Cette méthode est un contrôleur qui gère le succès d'un paiement effectué via Stripe et qui c
     * rée une commande si un objet Order correspondant à l'ID de session de paiement existe
     * dans la base de données.
     */
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

        if ($order) {
            // Vérifier l'état de paiement
            if ($session->payment_status === 'paid') {
                // Paiement réussi
                // Créer une nouvelle commande
                $order->setStatus($session->payment_status);
                $em->persist($order);

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
                $order->setStatus($session->payment_status);
                $em->persist($order);

                $em->flush();
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
