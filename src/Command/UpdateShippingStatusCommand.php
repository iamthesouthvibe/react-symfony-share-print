<?php

namespace App\Command;

use App\Entity\Order;
use App\Entity\Shipping;
use App\Entity\ShippingStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpClient\HttpClient;

class UpdateShippingStatusCommand extends Command
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setName('app:update-shipping-status')
            ->setDescription('Update shipping status of all orders');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $client = HttpClient::create();
        $orders = $this->entityManager->getRepository(Order::class)->findBy(['isSend' => true, 'isPrint' => true]);

        foreach ($orders as $order) {
            $idShipping = $order->getShipCode();
            if ($idShipping) {
                // Appel de l'API de suivi de La Poste pour récupérer l'état de l'expédition
                $response = $client->request('GET', 'https://api.laposte.fr/suivi/v2/idships/'.$idShipping, [
                'headers' => [
                    'X-Okapi-Key' => 'X6jFC4xixceQ5sDT2JtzUfaF52Me8A5Xez8+fpAqv+/6rkigbBo2MVLAp2tFHt9Z',
                ], ]);
                $data = $response->toArray();
                var_dump($data);
                $currentStatus = $data['shipment']['event'];
                $last_element = reset($currentStatus);
                // var_dump($last_element);
                // var_dump($last_element['code']);

                if (!empty($order->getShippings())) {
                    if ($order->getShippings()->last() !== false) {
                        $lastStatus = $order->getShippings()->last()->getShippingStatus()->getCode();
                        if ($last_element['code'] !== $lastStatus) {
                            $shipping = new Shipping();
                            $shipping->setPurchase($order);
                            $shippingStatus = $this->entityManager->getRepository(ShippingStatus::class)->findOneBy(['code' => $last_element['code']]);
                            $shipping->setShippingStatus($shippingStatus);
                            $shipping->setDate(new \DateTimeImmutable($last_element['date']));

                            $this->entityManager->persist($shipping);
                            $this->entityManager->flush();

                            $output->writeln(sprintf('Shipping status updated for order #%d', $order->getId()));
                        } else {
                            $output->writeln(sprintf('No update needed for order #%d', $order->getId()));
                        }
                    }
                }
            } else {
                $output->writeln(sprintf('error #%d', $order->getId()));
            }
        }

        return 0;
    }
}
