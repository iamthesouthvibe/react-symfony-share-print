<?php

namespace App\Controller;

use App\Entity\Campagne;
use App\Entity\Order;
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
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => $cartItem['price'] * 100, // Prix en centimes d'euro
                    'product_data' => [
                        'name' => $cartItem['name'],
                        'metadata' => [
                            'bonsoir' => 'bonsoir',
                            'idcampagne' => $cartItem['id'], // Ajouter l'ID du produit
                        ],
                    ],
                ],
                'quantity' => $cartItem['quantity'],
            ];
        }

        // Création de la session de checkout Stripe
        $checkoutSession = Session::create([
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
            'success_url' => 'http://127.0.0.1:8000/success?session_id={CHECKOUT_SESSION_ID}',
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

    #[Route('/success', name: 'app_success')]
    public function success(EntityManagerInterface $em, Request $request, SessionInterface $session)
    {
        // Récupérer l'ID de la session de paiement dans l'URL de la requête
        $sessionId = $request->query->get('session_id');

        // Récupérer l'objet de session de paiement correspondant à partir de l'API Stripe
        Stripe::setApiKey('sk_test_51LuG3LBECGZCUwAYsMyyQr9O86E7bX9ymy6U1vlUS31m4pIpZVs08eWenTXWGB3Be5cEu4FPmDG3YK6157NpXm69002Ioa9CIA');
        $session = Session::retrieve($sessionId);

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

            $line_items = Session::allLineItems($sessionId);
            foreach ($line_items->data as $line_item) {
                $productId = $line_item->price->product;
                $product = Product::retrieve($productId);
                $productName = $product->name;
                $productMetadata = $product->metadata;
                // dump($productMetadata->idcampagne);

                $order->addCampagne($em
                ->getRepository(Campagne::class)
                ->find($productMetadata->idcampagne));
            }

            $em->persist($order);
            $em->flush();

            return new JsonResponse(['success' => 'success']);
        // return $this->render('success.html.twig', ['message' => 'Paiement réussi!']);
        } else {
            // Paiement échoué ou en attente
            var_dump('failed');
            exit;

            return $this->render('success.html.twig', ['message' => 'Le paiement a échoué ou est en attente.']);
        }
    }
}
