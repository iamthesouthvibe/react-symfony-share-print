<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230221210149 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, customer_firstname VARCHAR(255) NOT NULL, customer_lastname VARCHAR(255) NOT NULL, customer_country VARCHAR(255) NOT NULL, customer_address VARCHAR(255) NOT NULL, customer_zip VARCHAR(10) NOT NULL, customer_city VARCHAR(50) NOT NULL, customer_mobile VARCHAR(11) DEFAULT NULL, customer_email VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE order_campagne (order_id INT NOT NULL, campagne_id INT NOT NULL, INDEX IDX_B263BFA78D9F6D38 (order_id), INDEX IDX_B263BFA716227374 (campagne_id), PRIMARY KEY(order_id, campagne_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE order_campagne ADD CONSTRAINT FK_B263BFA78D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE order_campagne ADD CONSTRAINT FK_B263BFA716227374 FOREIGN KEY (campagne_id) REFERENCES campagne (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE order_campagne DROP FOREIGN KEY FK_B263BFA78D9F6D38');
        $this->addSql('ALTER TABLE order_campagne DROP FOREIGN KEY FK_B263BFA716227374');
        $this->addSql('DROP TABLE `order`');
        $this->addSql('DROP TABLE order_campagne');
    }
}
