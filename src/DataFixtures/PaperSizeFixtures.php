<?php

namespace App\DataFixtures;

use App\Entity\PaperSize;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PaperSizeFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $paperSize = new PaperSize();
        $paperSize->setName('A4');
        $paperSize->setOrdre(0);
        $manager->persist($paperSize);
        $this->addReference('a4', $paperSize);

        $paperSize = new PaperSize();
        $paperSize->setName('A3');
        $paperSize->setOrdre(1);
        $manager->persist($paperSize);
        $this->addReference('a3', $paperSize);

        $paperSize = new PaperSize();
        $paperSize->setName('A2');
        $paperSize->setOrdre(2);
        $manager->persist($paperSize);
        $this->addReference('a2', $paperSize);

        $manager->flush();
    }
}
