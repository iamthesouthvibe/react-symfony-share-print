<?php

namespace App\Controller\admin;

use App\Entity\Lookbook;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class AdminLookBookController extends AbstractController
{
    #[Route('/api/marketing/lookbook/list', name: 'app_lookbook_list')]
    public function getLoobbookList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Token is invalid']);
        }

        $curuser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

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

    #[Route('/api/marketing/lookbook/add', name: 'app_lookbook_add')]
    public function addLookbook(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, SluggerInterface $slugger)
    {
        /* DATA */
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'You should to be connect for post campagne']);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'You should to be connect for post campagne']);
        }

        /* TRAITEMENTS */
        try {
            $lookbook = new Lookbook();

            // Gestion du PDF
            /** @var UploadedFile $uploadedFile */
            $fileSource = $request->files->get('file');
            $extension = pathinfo($fileSource->getClientOriginalName(), PATHINFO_EXTENSION);
            $originalFilename = pathinfo($fileSource->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid();
            $newFilenamePng = $newFilename.'.'.$extension;

            // init file system
            $fsObject = new Filesystem();
            $current_dir_path = getcwd();
            $new_dir_path = $this->getParameter('lookbook_dir');

            if (!$fsObject->exists($new_dir_path)) {
                $fsObject->mkdir($new_dir_path, 0775);
            }

            // Move the file to the directory
            try {
                $fileSource->move(
                    $new_dir_path,
                    $newFilenamePng
                );
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Error form'], 401);
            }

            $lookbook->setFilename($newFilename);
            $lookbook->setFileType($extension);

            $em->persist($lookbook);
            $em->flush();

            // Envoi d'une réponse de succès
            return new JsonResponse(['message' => 'Lookbook add successfully'], 201);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Error form'], 401);
        }
    }
}
