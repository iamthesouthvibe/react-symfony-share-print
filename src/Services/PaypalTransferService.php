<?php

namespace App\Services;

use PayPal\Api\Amount;
use PayPal\Api\Payout;
use PayPal\Api\PayoutSenderBatchHeader;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

class PaypalTransferService
{
    private $apiContext;
    private $clientId;
    private $clientSecret;

    public function __construct($clientId, $clientSecret)
    {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;

        // Configuration de l'API context avec les identifiants client
        $this->apiContext = new ApiContext(
            new OAuthTokenCredential($this->clientId, $this->clientSecret)
        );
    }

    public function transfer($amount, $currency, $recipientEmail)
    {
        // Configuration des informations de transfert
        $senderBatchHeader = new PayoutSenderBatchHeader();
        $senderBatchHeader->setSenderBatchId(uniqid())
            ->setEmailSubject('You have a payment');

        $amount = new Amount();
        $amount->setCurrency($currency)
            ->setValue($amount);

        $payout = new Payout();
        $payout->setSenderBatchHeader($senderBatchHeader)
            ->addItem($amount, $recipientEmail);

        // Effectuer le paiement
        $response = $payout->create(null, $this->apiContext);

        // Vérifier la réponse
        if ($response->getBatchHeader()->getBatchStatus() === 'SUCCESS') {
            return true;
        } else {
            return false;
        }
    }
}
