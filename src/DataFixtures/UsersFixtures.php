<?php

namespace App\DataFixtures;

use App\Entity\CreatorProfil;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UsersFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('leo.labeaume@hotmail.fr');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
            'ROLE_ADMIN',
        ]);
        $creator = new CreatorProfil();
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('emmamatthews@hotmail.fr');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Emma Matthews');
        $creator->setPaypalEmail('emmamatthews@paypal.fr');
        $creator->setBio('Emma specializes in elegant and sophisticated print designs, bringing a touch of class to branding materials and editorial layouts');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('maxcooper@hotmail.fr');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Max Cooper');
        $creator->setPaypalEmail('maxcooper@paypal.fr');
        $creator->setBio('Max is known for his bold and vibrant graphic designs, infusing energy and creativity into posters, packaging, and marketing collateral');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('oliviaTurner@hotmail.fr');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Olivia Turner');
        $creator->setPaypalEmail('oliviaTurner@paypal.fr');
        $creator->setBio('Olivia is a typography expert, combining exquisite typefaces with innovative layouts to create visually stunning print designs');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('ethansullivan@hotmail.fr');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Ethan Sullivan');
        $creator->setPaypalEmail('ethansullivan@paypal.fr');
        $creator->setBio('Ethan is a master of illustration, infusing his whimsical and imaginative artwork into book covers, children\'s prints, and greeting cards');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('avamitchell@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Ava Mitchell');
        $creator->setPaypalEmail('avamitchell@paypal.fr');
        $creator->setBio('Ava is a branding specialist who excels at creating cohesive visual identities, producing brand guidelines, and designing stunning business cards');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('leorodriguez@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Leo Rodriguez');
        $creator->setPaypalEmail('leorodriguez@paypal.fr');
        $creator->setBio('Leo is a packaging design guru, crafting eye-catching and functional packaging solutions that captivate consumers and enhance product experiences');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('miapatel@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Mia Patel');
        $creator->setPaypalEmail('miapatel@paypal.fr');
        $creator->setBio('Mia specializes in editorial design, skillfully curating content and creating engaging layouts for magazines, brochures, and annual reports');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('lucasanderson@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Lucas Anderson');
        $creator->setPaypalEmail('lucasanderson@paypal.fr');
        $creator->setBio('Lucas is a versatile designer with expertise in print advertising, producing captivating visuals for billboards, flyers, and print campaigns');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('chloewilson@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Chloe Wilson');
        $creator->setPaypalEmail('chloewilson@paypal.fr');
        $creator->setBio('Chloe is a skilled infographic designer, transforming complex data into visually appealing and easy-to-understand visual representations.');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('benjaminlee@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Benjamin Lee');
        $creator->setPaypalEmail('benjaminlee@paypal.fr');
        $creator->setBio('Benjamin is a print production expert, ensuring the seamless execution of print designs by collaborating with printers and overseeing quality control.');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('lilycarter@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Lily Carter');
        $creator->setPaypalEmail('lilycarter@paypal.fr');
        $creator->setBio('Lily is a talented print designer who specializes in creating unique wedding invitations, stationery, and event branding with a touch of elegance');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('noahthompson@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Noah Thompson');
        $creator->setPaypalEmail('noahthompson@paypal.fr');
        $creator->setBio('Noah is a minimalist design expert, known for his clean and sleek print designs that communicate messages with simplicity and clarity');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('gracemartin@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Grace Martin');
        $creator->setPaypalEmail('gracemartin@paypal.fr');
        $creator->setBio('Grace is a packaging structural designer, creating innovative and functional packaging solutions that stand out on retail shelves');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('oliverscott@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Oliver Scott');
        $creator->setPaypalEmail('oliverscott@paypal.fr');
        $creator->setBio('Oliver is a skilled print illustrator, bringing stories to life through captivating illustrations for children\'s books, posters, and merchandise');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $user = new User();
        $user->setEmail('sophiahall@gmail.com');
        $user->setPassword('$2y$13$Z1Rcvbd8qilG27L8jnOWUe0O2oSok.WCHo8z5N0nauU4CHMGvmwc.');
        $user->setRoles([
            'ROLE_CREATOR',
            'ROLE_USER',
        ]);
        $creator = new CreatorProfil();
        $creator->setDisplayName('Sophia Hall');
        $creator->setPaypalEmail('sophiahall@paypal.fr');
        $creator->setBio('Sophia is a print design strategist, working closely with clients to understand their objectives and develop effective print design solutions that drive results');
        $creator->setUser($user);
        $manager->persist($creator);
        $manager->persist($user);

        $manager->flush();
    }
}
