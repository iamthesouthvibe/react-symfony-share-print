<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230402145541 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne ADD total_ca DOUBLE PRECISION DEFAULT NULL, ADD total_taxamount DOUBLE PRECISION DEFAULT NULL, ADD total_benef_company DOUBLE PRECISION DEFAULT NULL, ADD total_benef_creator DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE shipping ADD CONSTRAINT FK_2D1C17242D02518A FOREIGN KEY (shipping_status_id) REFERENCES shipping_status (id)');
        $this->addSql('CREATE INDEX IDX_2D1C17242D02518A ON shipping (shipping_status_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne DROP total_ca, DROP total_taxamount, DROP total_benef_company, DROP total_benef_creator');
        $this->addSql('ALTER TABLE shipping DROP FOREIGN KEY FK_2D1C17242D02518A');
        $this->addSql('DROP INDEX IDX_2D1C17242D02518A ON shipping');
    }
}
