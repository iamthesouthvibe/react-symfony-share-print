<?php

namespace App\Controller;

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
}
