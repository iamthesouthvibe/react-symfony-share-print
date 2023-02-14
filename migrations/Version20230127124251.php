<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230127124251 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne ADD paper_id INT NOT NULL, ADD size_id INT NOT NULL, ADD weight_id INT NOT NULL');
        $this->addSql('ALTER TABLE campagne ADD CONSTRAINT FK_539B5D16E6758861 FOREIGN KEY (paper_id) REFERENCES paper_style (id)');
        $this->addSql('ALTER TABLE campagne ADD CONSTRAINT FK_539B5D16498DA827 FOREIGN KEY (size_id) REFERENCES paper_size (id)');
        $this->addSql('ALTER TABLE campagne ADD CONSTRAINT FK_539B5D16350035DC FOREIGN KEY (weight_id) REFERENCES paper_weight (id)');
        $this->addSql('CREATE INDEX IDX_539B5D16E6758861 ON campagne (paper_id)');
        $this->addSql('CREATE INDEX IDX_539B5D16498DA827 ON campagne (size_id)');
        $this->addSql('CREATE INDEX IDX_539B5D16350035DC ON campagne (weight_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE campagne DROP FOREIGN KEY FK_539B5D16E6758861');
        $this->addSql('ALTER TABLE campagne DROP FOREIGN KEY FK_539B5D16498DA827');
        $this->addSql('ALTER TABLE campagne DROP FOREIGN KEY FK_539B5D16350035DC');
        $this->addSql('DROP INDEX IDX_539B5D16E6758861 ON campagne');
        $this->addSql('DROP INDEX IDX_539B5D16498DA827 ON campagne');
        $this->addSql('DROP INDEX IDX_539B5D16350035DC ON campagne');
        $this->addSql('ALTER TABLE campagne DROP paper_id, DROP size_id, DROP weight_id');
    }
}
