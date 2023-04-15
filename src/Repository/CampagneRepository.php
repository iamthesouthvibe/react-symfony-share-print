<?php

namespace App\Repository;

use App\Entity\Campagne;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Campagne>
 *
 * @method Campagne|null find($id, $lockMode = null, $lockVersion = null)
 * @method Campagne|null findOneBy(array $criteria, array $orderBy = null)
 * @method Campagne[]    findAll()
 * @method Campagne[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CampagneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Campagne::class);
    }

    public function save(Campagne $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Campagne $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findPriceTotalInOrderPercampagne($id)
    {
        $manager = $this->getEntityManager();
        $conn = $manager->getConnection();
        $sql = 'SELECT campagne.id, campagne.price_ati, 
        SUM(campagne.price_ati * campagne_order.quantity) as totalCA, 
        SUM(campagne.total_tax * campagne_order.quantity) as totalTaxAmount,
        SUM(campagne.price_print * campagne_order.quantity) as totalPricePrint
        FROM `campagne_order` 
        INNER JOIN campagne on campagne_order.campagne_id = campagne.id 
        WHERE purchase_id = :purchase_id 
        GROUP BY campagne.id';
        $result = $conn->executeQuery($sql, ['purchase_id' => $id])->fetchAll();

        return $result;
    }

//    /**
//     * @return Campagne[] Returns an array of Campagne objects
//     */
   /*public function findLastId(): array
   {
       return $this->createQueryBuilder('c')
           ->orderBy('c.id', 'DESC')
           ->setMaxResults(1)
           ->getQuery()
           ->getResult()
       ;
   }

   public function findWithSearch($status, $createdAt)
   {
       $query = $this->createQueryBuilder('c');
        if($status !== NULL && $createdAt !== NULL) {
        $query = $query->join('c.status', 's')
                        ->andWhere('s.id IN (:status)')
                        ->setParameter('status',$status->getId())
                        ->orderBy('c.id', $createdAt);
        } elseif ($status !== NULL && $createdAt == NULL) {
            $query = $query->join('c.status', 's')
                        ->andWhere('s.id IN (:status)')
                        ->setParameter('status',$status->getId())
                        ->orderBy('c.id', 'DESC');
        } elseif ($status == NULL && $createdAt !== NULL) {
        $query = $query->orderBy('c.id', $createdAt);
        }
        return $query->getQuery()->getResult();
       ;
   } */
}
