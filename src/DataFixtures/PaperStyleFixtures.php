<?php

namespace App\DataFixtures;

use App\Entity\PaperStyle;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PaperStyleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $paperStyle = new PaperStyle();
        $paperStyle->setName('Couché');
        $paperStyle->setOrdre(0);
        $manager->persist($paperStyle);
        $this->addReference('paper_couche', $paperStyle);

        $paperStyle = new PaperStyle();
        $paperStyle->setName('Non couché');
        $paperStyle->setOrdre(1);
        $manager->persist($paperStyle);
        $this->addReference('paper_non_couche', $paperStyle);

        $manager->flush();
    }
}
