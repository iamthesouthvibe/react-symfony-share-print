<?php

namespace App\Repository;

use App\Entity\Order;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Order>
 *
 * @method Order|null find($id, $lockMode = null, $lockVersion = null)
 * @method Order|null findOneBy(array $criteria, array $orderBy = null)
 * @method Order[]    findAll()
 * @method Order[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function save(Order $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Order $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findOrderByCampagneAndQuantity()
    {
        $manager = $this->getEntityManager();
        $conn = $manager->getConnection();
        $sql = "SELECT campagne.id, campagne.file_source ,SUM(campagne_order.quantity) as total_quantity, 
            paper_size.name as size, paper_style.name as style, paper_weight.weight as weights
            FROM `order`
            INNER JOIN campagne_order ON `order`.id = campagne_order.purchase_id
            INNER JOIN campagne ON  campagne_order.campagne_id = campagne.id
            INNER JOIN paper_size ON  campagne.size_id = paper_size.id
            INNER JOIN paper_weight ON  campagne.weight_id = paper_weight.id
            INNER JOIN paper_style ON  campagne.paper_id = paper_style.id
            WHERE `order`.status = 'paid'
            AND `order`.is_send = 'false'
            AND `order`.is_print = 'false'
            GROUP BY campagne.id";
        $result = $conn->query($sql)->fetchAll();

        return $result;
    }

//    /**
//     * @return Order[] Returns an array of Order objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Order
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
