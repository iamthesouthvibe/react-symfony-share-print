<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

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

    #[ORM\OneToMany(mappedBy: 'purchase', targetEntity: CampagneOrder::class)]
    private Collection $campagneOrders;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    private ?User $user = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $sessionId = null;

    #[ORM\Column]
    private ?float $total_price = null;

    #[ORM\Column]
    private ?bool $isPrint = null;

    #[ORM\Column]
    private ?bool $isSend = null;

    #[ORM\Column(nullable: true)]
    private ?float $taxAmount = null;

    #[ORM\Column(nullable: true)]
    private ?float $deliveryPrice = null;

    #[ORM\Column(nullable: true)]
    private ?float $priceHt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $printAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $sendAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $shipCode = null;

    #[ORM\OneToMany(mappedBy: 'purchase', targetEntity: Shipping::class)]
    private Collection $shippings;

    public function __construct()
    {
        $this->campagneOrders = new ArrayCollection();
        $this->shippings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection<int, CampagneOrder>
     */
    public function getCampagneOrders(): Collection
    {
        return $this->campagneOrders;
    }

    public function addCampagneOrder(CampagneOrder $campagneOrder): self
    {
        if (!$this->campagneOrders->contains($campagneOrder)) {
            $this->campagneOrders->add($campagneOrder);
            $campagneOrder->setPurchase($this);
        }

        return $this;
    }

    public function removeCampagneOrder(CampagneOrder $campagneOrder): self
    {
        if ($this->campagneOrders->removeElement($campagneOrder)) {
            // set the owning side to null (unless already changed)
            if ($campagneOrder->getPurchase() === $this) {
                $campagneOrder->setPurchase(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getSessionId(): ?string
    {
        return $this->sessionId;
    }

    public function setSessionId(string $sessionId): self
    {
        $this->sessionId = $sessionId;

        return $this;
    }

    public function getTotalPrice(): ?float
    {
        return $this->total_price;
    }

    public function setTotalPrice(float $total_price): self
    {
        $this->total_price = $total_price;

        return $this;
    }

    public function getIsPrint(): ?bool
    {
        return $this->isPrint;
    }

    public function setIsPrint(bool $isPrint): self
    {
        $this->isPrint = $isPrint;

        return $this;
    }

    public function getIsSend(): ?bool
    {
        return $this->isSend;
    }

    public function setIsSend(bool $isSend): self
    {
        $this->isSend = $isSend;

        return $this;
    }

    public function getTaxAmount(): ?float
    {
        return $this->taxAmount;
    }

    public function setTaxAmount(?float $taxAmount): self
    {
        $this->taxAmount = $taxAmount;

        return $this;
    }

    public function getDeliveryPrice(): ?float
    {
        return $this->deliveryPrice;
    }

    public function setDeliveryPrice(?float $deliveryPrice): self
    {
        $this->deliveryPrice = $deliveryPrice;

        return $this;
    }

    public function getPriceHt(): ?float
    {
        return $this->priceHt;
    }

    public function setPriceHt(?float $priceHt): self
    {
        $this->priceHt = $priceHt;

        return $this;
    }

    public function getPrintAt(): ?\DateTimeImmutable
    {
        return $this->printAt;
    }

    public function setPrintAt(?\DateTimeImmutable $printAt): self
    {
        $this->printAt = $printAt;

        return $this;
    }

    public function getSendAt(): ?\DateTimeImmutable
    {
        return $this->sendAt;
    }

    public function setSendAt(?\DateTimeImmutable $sendAt): self
    {
        $this->sendAt = $sendAt;

        return $this;
    }

    public function getShipCode(): ?string
    {
        return $this->shipCode;
    }

    public function setShipCode(?string $shipCode): self
    {
        $this->shipCode = $shipCode;

        return $this;
    }

    /**
     * @return Collection<int, Shipping>
     */
    public function getShippings(): Collection
    {
        return $this->shippings;
    }

    public function addShipping(Shipping $shipping): self
    {
        if (!$this->shippings->contains($shipping)) {
            $this->shippings->add($shipping);
            $shipping->setPurchase($this);
        }

        return $this;
    }

    public function removeShipping(Shipping $shipping): self
    {
        if ($this->shippings->removeElement($shipping)) {
            // set the owning side to null (unless already changed)
            if ($shipping->getPurchase() === $this) {
                $shipping->setPurchase(null);
            }
        }

        return $this;
    }
}
