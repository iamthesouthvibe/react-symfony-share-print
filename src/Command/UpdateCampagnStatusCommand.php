<?php

namespace App\Command;

use App\Entity\Campagne;
use App\Entity\CampagneStatus;
use App\Services\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateCampagnStatusCommand extends Command
{
    private $entityManager;
    private $emailService;

    public function __construct(EntityManagerInterface $entityManager, EmailService $emailService)
    {
        $this->entityManager = $entityManager;
        $this->emailService = $emailService;

        parent::__construct();
    }

    protected function configure()
    {
        $this->setName('app:update-campganes-status')
            ->setDescription('Update campagnes status');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $campagnes = $this->entityManager->getRepository(Campagne::class)->findBy(['status' => 2]);

        foreach ($campagnes as $campagne) {
            $createdAt = $campagne->getAcceptedAt()->format('Y-m-d');
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));

            if ($days >= 46) {
                var_dump('hello');
                $campagneStatus = $this->entityManager->getRepository(CampagneStatus::class)->findOneBy(['id' => 3]);
                $campagne->setStatus($campagneStatus);

                $nbvente = 0;
                foreach ($campagne->getCampagneOrders() as $key => $campagneOrder) {
                    if ($campagneOrder->getPurchase()->getStatus() == 'paid') {
                        $nbvente = $campagneOrder->getQuantity() + $nbvente;
                    }
                }
                $creator = $campagne->getUser();

                $this->entityManager->persist($campagne);
                $this->entityManager->flush();

                $this->emailService->sendEmail(
                    'emails/template.html.twig',
                    [
                        'firstName' => $creator->getFirstName() ?? '',
                        'lastName' => $creator->getLastName() ?? '',
                        'message' => 'Hello, your campaign is now over. You sold: '.$nbvente.' 
                        posters for a total profit of '.$campagne->getTotalBenefCreator().'€. Please fill in your
                        paypal email to receive the benefits.',
                    ],
                    $creator->getEmail(),
                    'Congratulations your campaign is over!'
                );

                $output->writeln(sprintf('Campagne status updated for #%d', $campagne->getId()));
            }
            var_dump($days);
        }

        return 0;
    }
}
