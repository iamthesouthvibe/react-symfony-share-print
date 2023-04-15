<?php

namespace App\Entity;

use App\Repository\ShippingRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ShippingRepository::class)]
class Shipping
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'shippings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $purchase = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $date = null;

    #[ORM\ManyToOne(inversedBy: 'shippings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ShippingStatus $shippingStatus = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPurchase(): ?Order
    {
        return $this->purchase;
    }

    public function setPurchase(?Order $purchase): self
    {
        $this->purchase = $purchase;

        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getShippingStatus(): ?ShippingStatus
    {
        return $this->shippingStatus;
    }

    public function setShippingStatus(?ShippingStatus $shippingStatus): self
    {
        $this->shippingStatus = $shippingStatus;

        return $this;
    }
}
