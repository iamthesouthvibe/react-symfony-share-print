<?php

namespace App\Controller;

use App\Entity\Campagne;
use App\Entity\CreatorProfil;
use App\Entity\Lookbook;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * Il s'agit d'une fonction qui permet d'afficher une liste des 5 dernieres campagnes ajoutées.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/list/home/last', name: 'app_home_last')]
    public function lastProducts(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        // Get all campagnes
        $campagnes = $em->getRepository(Campagne::class)->findBy(['status' => 2, 'isBest' => false], ['id' => 'DESC'], 3);

        $data = [];

        foreach ($campagnes as $campagne) {
            $name = ($campagne->getUser()->getCreatorProfil() !== null) ? $campagne->getUser()->getCreatorProfil()->getDisplayName() : $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName();

            $createdAt = $campagne->getAcceptedAt()->format('Y-m-d');
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));

            $data[] = [
               'id' => $campagne->getId(),
               'nameproject' => $campagne->getNameProject(),
               'fileSource' => $campagne->getFileSource().'.png',
               'userid' => $campagne->getUser()->getId(),
               'name' => $name,
               'slug' => $campagne->getSlug(),
               'price' => $campagne->getPriceAti(),
               'days' => $days,
           ];
        }

        return new JsonResponse(['campagnes' => array_reverse($data)]);
    }

    /**
     * Il s'agit d'une fonction qui permet d'afficher une liste des 5 dernieres campagnes bestseller.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/list/home/best', name: 'app_home_best')]
    public function bestSellers(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        // Get all campagnes
        $campagnes = $em->getRepository(Campagne::class)->findBy(['status' => 2, 'isBest' => true], ['id' => 'DESC'], 3);

        $data = [];

        foreach ($campagnes as $campagne) {
            $name = ($campagne->getUser()->getCreatorProfil() !== null) ? $campagne->getUser()->getCreatorProfil()->getDisplayName() : $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName();

            $createdAt = $campagne->getAcceptedAt()->format('Y-m-d');
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));

            $data[] = [
               'id' => $campagne->getId(),
               'nameproject' => $campagne->getNameProject(),
               'fileSource' => $campagne->getFileSource().'.png',
               'name' => $name,
               'userid' => $campagne->getUser()->getId(),
               'slug' => $campagne->getSlug(),
               'price' => $campagne->getPriceAti(),
               'days' => $days,
           ];
        }

        return new JsonResponse(['campagnes' => array_reverse($data)]);
    }

    /**
     * Il s'agit d'une fonction qui permet d'afficher une liste des 5 derniers createurs ajoutées.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/list/home/creators', name: 'app_home_creators')]
    public function getCreators(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        // TODO:: Trouver un moyen de faire une requete sur filename is not null
        $creators = $em->getRepository(CreatorProfil::class)->findBy([], ['id' => 'DESC'], 5);

        foreach ($creators as $creator) {
            $name = ($creator->getDisplayName() !== null) ? $creator->getDisplayName() : $creator->getUser()->getFirstName().' '.$creator->getUser()->getLastName();
            $data[] = [
               'id' => $creator->getId(),
               'fileSource' => $creator->getFilename(),
               'name' => $name,
           ];
        }

        return new JsonResponse(['creators' => array_reverse($data)]);
    }

    /**
     * Il s'agit d'une fonction qui permet d'afficher une liste des 2 derniers lookbooks ajoutées.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/list/home/lookbooks', name: 'app_home_lookbooks')]
    public function getLookbooks(EntityManagerInterface $em, Request $request): Response
    {
        // TODO:: Trouver un moyen de faire une requete sur filename is not null
        $lookbooks = $em->getRepository(Lookbook::class)->findBy([], ['id' => 'DESC'], 2);

        $data = [];

        foreach ($lookbooks as $lookbook) {
            $data[] = [
                'id' => $lookbook->getId(),
                'filesource' => $lookbook->getFilename().'.'.$lookbook->getFileType(),
           ];
        }

        return new JsonResponse(['lookbooks' => array_reverse($data)]);
    }
}
