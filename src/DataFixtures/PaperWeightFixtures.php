<?php

namespace App\DataFixtures;

use App\Entity\PaperWeight;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PaperWeightFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $paperWeight = new PaperWeight();
        $paperWeight->setWeight(130);
        $paperWeight->setOrdre(0);
        $manager->persist($paperWeight);

        $paperWeight = new PaperWeight();
        $paperWeight->setWeight(160);
        $paperWeight->setOrdre(1);
        $manager->persist($paperWeight);

        $manager->flush();
    }
}
