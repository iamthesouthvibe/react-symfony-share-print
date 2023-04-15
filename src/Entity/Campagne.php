<?php

namespace App\Entity;

use App\Repository\CampagneRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CampagneRepository::class)]
class Campagne
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $fileSource = null;

    #[ORM\Column(length: 255)]
    private ?string $nameProject = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'campagnes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'campagnes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?PaperStyle $paper = null;

    #[ORM\ManyToOne(inversedBy: 'campagnes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?PaperSize $size = null;

    #[ORM\ManyToOne(inversedBy: 'campagnes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?PaperWeight $weight = null;

    #[ORM\Column(length: 255)]
    private ?string $num_commande = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'campagnes')]
    private ?CampagneStatus $status = null;

    #[ORM\OneToOne(mappedBy: 'campagne', cascade: ['persist', 'remove'])]
    private ?Product $product = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $slug = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $acceptedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $rejectAt = null;

    #[ORM\OneToMany(mappedBy: 'campagne', targetEntity: CampagneLog::class)]
    private Collection $campagneLogs;

    #[ORM\OneToMany(mappedBy: 'campagne', targetEntity: CampagneOrder::class)]
    private Collection $campagneOrders;

    #[ORM\Column(nullable: true)]
    private ?float $totalTax = null;

    #[ORM\Column(nullable: true)]
    private ?float $priceAti = null;

    #[ORM\Column(nullable: true)]
    private ?float $totalCa = null;

    #[ORM\Column(nullable: true)]
    private ?float $totalTaxamount = null;

    #[ORM\Column(nullable: true)]
    private ?float $totalBenefCompany = null;

    #[ORM\Column(nullable: true)]
    private ?float $totalBenefCreator = null;

    #[ORM\Column(nullable: true)]
    private ?float $pricePrint = null;

    #[ORM\Column(nullable: true)]
    private ?float $totalPricePrint = null;

    #[ORM\Column]
    private ?bool $isBest = null;

    public function __construct()
    {
        $this->campagneLogs = new ArrayCollection();
        $this->campagneOrders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFileSource(): ?string
    {
        return $this->fileSource;
    }

    public function setFileSource(string $fileSource): self
    {
        $this->fileSource = $fileSource;

        return $this;
    }

    public function getNameProject(): ?string
    {
        return $this->nameProject;
    }

    public function setNameProject(string $nameProject): self
    {
        $this->nameProject = $nameProject;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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

    public function getPaper(): ?PaperStyle
    {
        return $this->paper;
    }

    public function setPaper(?PaperStyle $paper): self
    {
        $this->paper = $paper;

        return $this;
    }

    public function getSize(): ?PaperSize
    {
        return $this->size;
    }

    public function setSize(?PaperSize $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getWeight(): ?PaperWeight
    {
        return $this->weight;
    }

    public function setWeight(?PaperWeight $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getNumCommande(): ?string
    {
        return $this->num_commande;
    }

    public function setNumCommande(string $num_commande): self
    {
        $this->num_commande = $num_commande;

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

    public function getStatus(): ?CampagneStatus
    {
        return $this->status;
    }

    public function setStatus(?CampagneStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    /*
    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(Product $product): self
    {
        // set the owning side of the relation if necessary
        if ($product->getCampagne() !== $this) {
            $product->setCampagne($this);
        }

        $this->product = $product;

        return $this;
    } */

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(Product $product): self
    {
        // set the owning side of the relation if necessary
        if ($product->getCampagne() !== $this) {
            $product->setCampagne($this);
        }

        $this->product = $product;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getAcceptedAt(): ?\DateTimeImmutable
    {
        return $this->acceptedAt;
    }

    public function setAcceptedAt(?\DateTimeImmutable $acceptedAt): self
    {
        $this->acceptedAt = $acceptedAt;

        return $this;
    }

    public function getRejectAt(): ?\DateTimeImmutable
    {
        return $this->rejectAt;
    }

    public function setRejectAt(?\DateTimeImmutable $rejectAt): self
    {
        $this->rejectAt = $rejectAt;

        return $this;
    }

    /**
     * @return Collection<int, CampagneLog>
     */
    public function getCampagneLogs(): Collection
    {
        return $this->campagneLogs;
    }

    public function addCampagneLog(CampagneLog $campagneLog): self
    {
        if (!$this->campagneLogs->contains($campagneLog)) {
            $this->campagneLogs->add($campagneLog);
            $campagneLog->setCampagne($this);
        }

        return $this;
    }

    public function removeCampagneLog(CampagneLog $campagneLog): self
    {
        if ($this->campagneLogs->removeElement($campagneLog)) {
            // set the owning side to null (unless already changed)
            if ($campagneLog->getCampagne() === $this) {
                $campagneLog->setCampagne(null);
            }
        }

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
            $campagneOrder->setCampagne($this);
        }

        return $this;
    }

    public function removeCampagneOrder(CampagneOrder $campagneOrder): self
    {
        if ($this->campagneOrders->removeElement($campagneOrder)) {
            // set the owning side to null (unless already changed)
            if ($campagneOrder->getCampagne() === $this) {
                $campagneOrder->setCampagne(null);
            }
        }

        return $this;
    }

    public function getTotalTax(): ?float
    {
        return $this->totalTax;
    }

    public function setTotalTax(?float $totalTax): self
    {
        $this->totalTax = $totalTax;

        return $this;
    }

    public function getPriceAti(): ?float
    {
        return $this->priceAti;
    }

    public function setPriceAti(?float $priceAti): self
    {
        $this->priceAti = $priceAti;

        return $this;
    }

    public function getTotalCa(): ?float
    {
        return $this->totalCa;
    }

    public function setTotalCa(?float $totalCa): self
    {
        $this->totalCa = $totalCa;

        return $this;
    }

    public function getTotalTaxamount(): ?float
    {
        return $this->totalTaxamount;
    }

    public function setTotalTaxamount(?float $totalTaxamount): self
    {
        $this->totalTaxamount = $totalTaxamount;

        return $this;
    }

    public function getTotalBenefCompany(): ?float
    {
        return $this->totalBenefCompany;
    }

    public function setTotalBenefCompany(?float $totalBenefCompany): self
    {
        $this->totalBenefCompany = $totalBenefCompany;

        return $this;
    }

    public function getTotalBenefCreator(): ?float
    {
        return $this->totalBenefCreator;
    }

    public function setTotalBenefCreator(?float $totalBenefCreator): self
    {
        $this->totalBenefCreator = $totalBenefCreator;

        return $this;
    }

    public function getPricePrint(): ?float
    {
        return $this->pricePrint;
    }

    public function setPricePrint(?float $pricePrint): self
    {
        $this->pricePrint = $pricePrint;

        return $this;
    }

    public function getTotalPricePrint(): ?float
    {
        return $this->totalPricePrint;
    }

    public function setTotalPricePrint(?float $totalPricePrint): self
    {
        $this->totalPricePrint = $totalPricePrint;

        return $this;
    }

    public function isIsBest(): ?bool
    {
        return $this->isBest;
    }

    public function setIsBest(bool $isBest): self
    {
        $this->isBest = $isBest;

        return $this;
    }
}
