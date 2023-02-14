<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230123193242 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE campagne (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, file_source VARCHAR(255) NOT NULL, name_project VARCHAR(255) NOT NULL, price INT NOT NULL, description LONGTEXT NOT NULL, num_commande VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_539B5D16A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE creator_profil (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, display_name VARCHAR(255) DEFAULT NULL, bio LONGTEXT DEFAULT NULL, instagram VARCHAR(255) DEFAULT NULL, linkedin VARCHAR(255) DEFAULT NULL, dribble VARCHAR(255) DEFAULT NULL, behance VARCHAR(255) DEFAULT NULL, payout_firstname VARCHAR(255) DEFAULT NULL, payout_lastname VARCHAR(255) DEFAULT NULL, payout_organisation VARCHAR(255) DEFAULT NULL, invoice_address VARCHAR(255) DEFAULT NULL, invoice_city VARCHAR(255) DEFAULT NULL, invoice_country VARCHAR(255) DEFAULT NULL, invoice_zip VARCHAR(10) DEFAULT NULL, paypal_email VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_CA803F0AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE campagne ADD CONSTRAINT FK_539B5D16A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE creator_profil ADD CONSTRAINT FK_CA803F0AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne DROP FOREIGN KEY FK_539B5D16A76ED395');
        $this->addSql('ALTER TABLE creator_profil DROP FOREIGN KEY FK_CA803F0AA76ED395');
        $this->addSql('DROP TABLE campagne');
        $this->addSql('DROP TABLE creator_profil');
    }
}
