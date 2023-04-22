<?php

namespace App\Controller;

use App\Entity\CreatorProfil;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CreatorListController extends AbstractController
{
    #[Route('/api/list/page/creators', name: 'app_list_creatorssss')]
    public function getCreatorsListtttt(EntityManagerInterface $em, Request $request)
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
