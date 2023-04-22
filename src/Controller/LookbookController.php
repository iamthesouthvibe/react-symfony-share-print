<?php

namespace App\Controller;

use App\Entity\CreatorProfil;
use App\Entity\Lookbook;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class LookbookController extends AbstractController
{
    #[Route('/api/lookbook/list', name: 'app_lookbook_list_client')]
    public function getLoobbookList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        // Get all users
        $lookbooks = $em->getRepository(Lookbook::class)->findAll();

        $data = [];

        foreach ($lookbooks as $lookbook) {
            $data[] = [
                'id' => $lookbook->getId(),
                'filesource' => $lookbook->getFilename().'.'.$lookbook->getFileType(),
           ];
        }

        return new JsonResponse(['lookbooks' => array_reverse($data)]);
    }

    #[Route('/api/list/creators', name: 'app_list_creators')]
    public function getCreatorsList(EntityManagerInterface $em, Request $request): Response
    {
        // TODO:: Trouver un moyen de faire une requete sur filename is not null
        $creators = $em->getRepository(CreatorProfil::class)->findAll();

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
