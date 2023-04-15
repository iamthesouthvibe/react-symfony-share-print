<?php

namespace App\Controller;

use App\Entity\CreatorProfil;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CreatorsListController extends AbstractController
{
    #[Route('/api/list/creators', name: 'app_creators')]
    public function getCreators(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request): Response
    {
        // TODO:: Trouver un moyen de faire une requete sur filename is not null
        $creators = $em->getRepository(CreatorProfil::class)->findBy([], ['id' => 'DESC']);

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
}
