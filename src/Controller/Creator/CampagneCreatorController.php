<?php

namespace App\Controller\Creator;

use App\Entity\Campagne;
use App\Entity\CampagneStatus;
use App\Entity\PaperSize;
use App\Entity\PaperStyle;
use App\Entity\PaperWeight;
use App\Entity\User;
use App\Services\EmailService;
use App\Services\LogServices;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Spatie\PdfToImage\Pdf;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class CampagneCreatorController extends AbstractController
{
    #[Route('/api/campagne/add', name: 'app_campagne_add')]
    public function addCampagne(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, SluggerInterface $slugger, EmailService $emailService, LogServices $LogServices)
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
            $campagne = new Campagne();

            // Gestion du PDF
            /** @var UploadedFile $uploadedFile */
            $fileSource = $request->files->get('file');
            $extension = pathinfo($fileSource->getClientOriginalName(), PATHINFO_EXTENSION);
            $originalFilename = pathinfo($fileSource->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid();
            $newFilenamePdf = $newFilename.'.'.$extension;
            $newFilenamePng = $newFilename.'.png';

            // init file system
            $fsObject = new Filesystem();
            $current_dir_path = getcwd();
            $new_dir_path = $this->getParameter('campagnes_dir').'/'.$user->getId();

            if (!$fsObject->exists($new_dir_path)) {
                $fsObject->mkdir($new_dir_path, 0775);
            }

            // Move the file to the directory
            try {
                $fileSource->move(
                    $new_dir_path,
                    $newFilenamePdf
                );
            } catch (FileException $e) {
                var_dump($e);
            }

            $campagne->setFileSource($newFilename);

            // Convert PDF file to image
            $outputImagePath = $this->getParameter('campagnes_dir').'/'.$user->getId().'/'.$newFilenamePng;
            $pdf = new Pdf($new_dir_path.'/'.$newFilenamePdf);
            $pdf->setOutputFormat('png')
                    ->setResolution(60)
                    ->saveImage($outputImagePath);

            // Creation numéro de commande
            $lastObject = $em->getRepository(Campagne::class)->findBy([], ['id' => 'DESC'], 1, 0);
            $today = date('Ymd');
            $rand = strtoupper(substr(uniqid(sha1(time())), 0, 4));
            if (count($lastObject) == 1) {
                foreach ($lastObject as $last) {
                    $lastId = $last->getId();
                }
                $unique = 'N'.$today.$rand.($lastId + 1);
            } else {
                $unique = 'N'.$today.$rand.'1';
            }
            $campagne->setNumCommande($unique);

            // Set weight
            $weight = $em->getRepository(PaperWeight::class)->findOneBy(['weight' => $request->request->get('weight')], []);
            $campagne->setWeight($weight);

            // Set style
            $paper = $em->getRepository(PaperStyle::class)->findOneBy(['name' => $request->request->get('paper')], []);
            $campagne->setPaper($paper);

            // Set size
            $size = $em->getRepository(PaperSize::class)->findOneBy(['name' => $request->request->get('size')], []);
            $campagne->setSize($size);

            $campagne->setNameProject($request->request->get('projectName'));
            $campagne->setPrice($request->request->get('price'));
            $campagne->setDescription($request->request->get('description'));
            $campagne->setStatus($em->getRepository(CampagneStatus::class)->findOneBy(['id' => 1], []));

            $campagne->setUser($user);
            $campagne->setCreatedAt(new \DateTimeImmutable());
            $user->setRoles(['ROLE_CREATOR', 'ROLE_USER']);
            $em->persist($campagne);
            $em->persist($user);
            $em->flush();

            // $user->setAddress($address);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Error form'], 401);
        }

        // Log
        $LogServices->createLog($user, 'Une nouvelle campagne '.$campagne->getId().' a été crée par '.$user->getEmail(), 'CAMPAGNE');
        $LogServices->createCampagneLog($campagne, 'Campagne crée', 'CAMPAGNE_CREATE');

        $emailService->sendEmail(
            'emails/template.html.twig',
            [
                'firstName' => $user->getFirstName() ?? '',
                'lastName' => $user->getLastName() ?? '',
                'message' => 'Votre campagne a bien été soumise. Vous recevrez un email de confirmation quand votre produit sera en ligne',
            ],
            $user->getEmail(),
            'Votre campagne a bien été soumise'
        );

        // Log
        $LogServices->createLog($user, 'Un email de confirmation a été envoyé pour la campagne '.$campagne->getId().' à '.$user->getEmail(), 'CAMPAGNE');

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'Campagne add successfully'], 201);
    }
}
