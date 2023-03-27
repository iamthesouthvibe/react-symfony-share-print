<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface, JWTUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $firstName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lastName = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    private ?Address $address = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?CreatorProfil $creatorProfil = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Campagne::class, orphanRemoval: true)]
    private Collection $campagnes;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserLog::class, orphanRemoval: true)]
    private Collection $userLogs;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Order::class)]
    private Collection $orders;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resetToken = null;

    public function __construct()
    {
        $this->addresses = new ArrayCollection();
        $this->campagnes = new ArrayCollection();
        $this->userLogs = new ArrayCollection();
        $this->orders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public static function createFromPayload($username, array $payload)
    {
        $user = new User();
        $user->setEmail($email);
        $user->setId($payload['id']);
        // you can add other properties as well
        return $user;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getCreatorProfil(): ?CreatorProfil
    {
        return $this->creatorProfil;
    }

    public function setCreatorProfil(CreatorProfil $creatorProfil): self
    {
        // set the owning side of the relation if necessary
        if ($creatorProfil->getUser() !== $this) {
            $creatorProfil->setUser($this);
        }

        $this->creatorProfil = $creatorProfil;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, UserLog>
     */
    public function getUserLogs(): Collection
    {
        return $this->userLogs;
    }

    public function addUserLog(UserLog $userLog): self
    {
        if (!$this->userLogs->contains($userLog)) {
            $this->userLogs->add($userLog);
            $userLog->setUser($this);
        }

        return $this;
    }

    public function removeUserLog(UserLog $userLog): self
    {
        if ($this->userLogs->removeElement($userLog)) {
            // set the owning side to null (unless already changed)
            if ($userLog->getUser() === $this) {
                $userLog->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Campagne>
     */
    public function getCampagnes(): Collection
    {
        return $this->campagnes;
    }

    public function addCampagne(Campagne $campagne): self
    {
        if (!$this->campagnes->contains($campagne)) {
            $this->campagnes->add($campagne);
            $campagne->setUser($this);
        }

        return $this;
    }

    public function removeCampagne(Campagne $campagne): self
    {
        if ($this->campagnes->removeElement($campagne)) {
            // set the owning side to null (unless already changed)
            if ($campagne->getUser() === $this) {
                $campagne->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): self
    {
        if (!$this->orders->contains($order)) {
            $this->orders->add($order);
            $order->setUser($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): self
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getUser() === $this) {
                $order->setUser(null);
            }
        }

        return $this;
    }

    public function getResetToken(): ?string
    {
        return $this->resetToken;
    }

    public function setResetToken(?string $resetToken): self
    {
        $this->resetToken = $resetToken;

        return $this;
    }
}
