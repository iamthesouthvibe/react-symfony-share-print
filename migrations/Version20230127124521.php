<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230127124521 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE campagne_status (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE campagne ADD status_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE campagne ADD CONSTRAINT FK_539B5D166BF700BD FOREIGN KEY (status_id) REFERENCES campagne_status (id)');
        $this->addSql('CREATE INDEX IDX_539B5D166BF700BD ON campagne (status_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne DROP FOREIGN KEY FK_539B5D166BF700BD');
        $this->addSql('DROP TABLE campagne_status');
        $this->addSql('DROP INDEX IDX_539B5D166BF700BD ON campagne');
        $this->addSql('ALTER TABLE campagne DROP status_id');
    }
}
