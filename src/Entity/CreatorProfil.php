<?php

namespace App\Entity;

use App\Repository\CreatorProfilRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CreatorProfilRepository::class)]
class CreatorProfil
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $displayName = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $instagram = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $linkedin = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $dribble = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $behance = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $payoutFirstname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $payoutLastname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $payoutOrganisation = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $invoiceAddress = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $invoiceCity = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $invoiceCountry = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $invoiceZip = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $paypalEmail = null;

    #[ORM\OneToOne(inversedBy: 'creatorProfil', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(?string $displayName): self
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): self
    {
        $this->bio = $bio;

        return $this;
    }

    public function getInstagram(): ?string
    {
        return $this->instagram;
    }

    public function setInstagram(?string $instagram): self
    {
        $this->instagram = $instagram;

        return $this;
    }

    public function getLinkedin(): ?string
    {
        return $this->linkedin;
    }

    public function setLinkedin(?string $linkedin): self
    {
        $this->linkedin = $linkedin;

        return $this;
    }

    public function getDribble(): ?string
    {
        return $this->dribble;
    }

    public function setDribble(?string $dribble): self
    {
        $this->dribble = $dribble;

        return $this;
    }

    public function getBehance(): ?string
    {
        return $this->behance;
    }

    public function setBehance(?string $behance): self
    {
        $this->behance = $behance;

        return $this;
    }

    public function getPayoutFirstname(): ?string
    {
        return $this->payoutFirstname;
    }

    public function setPayoutFirstname(?string $payoutFirstname): self
    {
        $this->payoutFirstname = $payoutFirstname;

        return $this;
    }

    public function getPayoutLastname(): ?string
    {
        return $this->payoutLastname;
    }

    public function setPayoutLastname(?string $payoutLastname): self
    {
        $this->payoutLastname = $payoutLastname;

        return $this;
    }

    public function getPayoutOrganisation(): ?string
    {
        return $this->payoutOrganisation;
    }

    public function setPayoutOrganisation(?string $payoutOrganisation): self
    {
        $this->payoutOrganisation = $payoutOrganisation;

        return $this;
    }

    public function getInvoiceAddress(): ?string
    {
        return $this->invoiceAddress;
    }

    public function setInvoiceAddress(?string $invoiceAddress): self
    {
        $this->invoiceAddress = $invoiceAddress;

        return $this;
    }

    public function getInvoiceCity(): ?string
    {
        return $this->invoiceCity;
    }

    public function setInvoiceCity(?string $invoiceCity): self
    {
        $this->invoiceCity = $invoiceCity;

        return $this;
    }

    public function getInvoiceCountry(): ?string
    {
        return $this->invoiceCountry;
    }

    public function setInvoiceCountry(?string $invoiceCountry): self
    {
        $this->invoiceCountry = $invoiceCountry;

        return $this;
    }

    public function getInvoiceZip(): ?string
    {
        return $this->invoiceZip;
    }

    public function setInvoiceZip(?string $invoiceZip): self
    {
        $this->invoiceZip = $invoiceZip;

        return $this;
    }

    public function getPaypalEmail(): ?string
    {
        return $this->paypalEmail;
    }

    public function setPaypalEmail(?string $paypalEmail): self
    {
        $this->paypalEmail = $paypalEmail;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
