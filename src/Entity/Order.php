<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToMany(targetEntity: Campagne::class, inversedBy: 'orders')]
    private Collection $campagne;

    #[ORM\Column(length: 255)]
    private ?string $customerFirstname = null;

    #[ORM\Column(length: 255)]
    private ?string $customerLastname = null;

    #[ORM\Column(length: 255)]
    private ?string $customerCountry = null;

    #[ORM\Column(length: 255)]
    private ?string $customerAddress = null;

    #[ORM\Column(length: 10)]
    private ?string $customerZip = null;

    #[ORM\Column(length: 50)]
    private ?string $customerCity = null;

    #[ORM\Column(length: 11, nullable: true)]
    private ?string $customerMobile = null;

    #[ORM\Column(length: 255)]
    private ?string $customerEmail = null;

    public function __construct()
    {
        $this->campagne = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Campagne>
     */
    public function getCampagne(): Collection
    {
        return $this->campagne;
    }

    public function addCampagne(Campagne $campagne): self
    {
        if (!$this->campagne->contains($campagne)) {
            $this->campagne->add($campagne);
        }

        return $this;
    }

    public function removeCampagne(Campagne $campagne): self
    {
        $this->campagne->removeElement($campagne);

        return $this;
    }

    public function getCustomerFirstname(): ?string
    {
        return $this->customerFirstname;
    }

    public function setCustomerFirstname(string $customerFirstname): self
    {
        $this->customerFirstname = $customerFirstname;

        return $this;
    }

    public function getCustomerLastname(): ?string
    {
        return $this->customerLastname;
    }

    public function setCustomerLastname(string $customerLastname): self
    {
        $this->customerLastname = $customerLastname;

        return $this;
    }

    public function getCustomerCountry(): ?string
    {
        return $this->customerCountry;
    }

    public function setCustomerCountry(string $customerCountry): self
    {
        $this->customerCountry = $customerCountry;

        return $this;
    }

    public function getCustomerAddress(): ?string
    {
        return $this->customerAddress;
    }

    public function setCustomerAddress(string $customerAddress): self
    {
        $this->customerAddress = $customerAddress;

        return $this;
    }

    public function getCustomerZip(): ?string
    {
        return $this->customerZip;
    }

    public function setCustomerZip(string $customerZip): self
    {
        $this->customerZip = $customerZip;

        return $this;
    }

    public function getCustomerCity(): ?string
    {
        return $this->customerCity;
    }

    public function setCustomerCity(string $customerCity): self
    {
        $this->customerCity = $customerCity;

        return $this;
    }

    public function getCustomerMobile(): ?string
    {
        return $this->customerMobile;
    }

    public function setCustomerMobile(?string $customerMobile): self
    {
        $this->customerMobile = $customerMobile;

        return $this;
    }

    public function getCustomerEmail(): ?string
    {
        return $this->customerEmail;
    }

    public function setCustomerEmail(string $customerEmail): self
    {
        $this->customerEmail = $customerEmail;

        return $this;
    }
}
