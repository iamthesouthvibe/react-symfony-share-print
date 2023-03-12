<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230310100744 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE campagne_order (id INT AUTO_INCREMENT NOT NULL, purchase_id INT NOT NULL, campagne_id INT NOT NULL, quantity INT NOT NULL, INDEX IDX_6EA663B4558FBEB9 (purchase_id), INDEX IDX_6EA663B416227374 (campagne_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE campagne_order ADD CONSTRAINT FK_6EA663B4558FBEB9 FOREIGN KEY (purchase_id) REFERENCES `order` (id)');
        $this->addSql('ALTER TABLE campagne_order ADD CONSTRAINT FK_6EA663B416227374 FOREIGN KEY (campagne_id) REFERENCES campagne (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne_order DROP FOREIGN KEY FK_6EA663B4558FBEB9');
        $this->addSql('ALTER TABLE campagne_order DROP FOREIGN KEY FK_6EA663B416227374');
        $this->addSql('DROP TABLE campagne_order');
    }
}
