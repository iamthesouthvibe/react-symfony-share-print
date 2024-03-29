<?php

namespace App\Controller\Creator;

use App\Entity\Campagne;
use App\Entity\CampagneStatus;
use App\Entity\CreatorProfil;
use App\Entity\PaperSize;
use App\Entity\PaperStyle;
use App\Entity\PaperWeight;
use App\Entity\User;
use App\Services\EmailService;
use App\Services\LogServices;
use Doctrine\ORM\EntityManagerInterface;
use Intervention\Image\ImageManagerStatic as Image;
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
    /**
     * Il s'agit d'une fonction qui crée une nouvelle campagne.
     * Il a l'itinéraire /api/campagne/addet le nom app_campagne_add.
     *
     * @param entityManagerInterface $em:           une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder:   une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:      une instance de la classe Request, qui contient des informations sur la requête HTTP
     * @param sluggerInterface       $slugger:      une instance de la SluggerInterfaceclasse, utilisée pour créer un slug à partir du nom de fichier du PDF téléchargé
     * @param EmailService           $emailService: une instance de la EmailServiceclasse, utilisée pour envoyer des emails
     * @param LogServices            $LogServices:  une instance de la LogServicesclasse, utilisée pour la journalisation
     */
    #[Route('/api/campagne/add', name: 'app_campagne_add')]
    public function addCampagne(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request, SluggerInterface $slugger, EmailService $emailService, LogServices $LogServices)
    {
        /* DATA */
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        // Récupère d'abord le JWT à partir de l'en-tête de la demande et le décode pour obtenir l'e-mail de l'utilisateur. Il récupère ensuite l'objet utilisateur de la base de données à l'aide de l'e-mail.
        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'You should to be connect for post campagne'], 401);
        }
        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        // Si l'utilisateur n'existe pas, la fonction renvoie une réponse d'erreur 404.
        if (!$user) {
            return new JsonResponse(['error' => 'You should to be connect for post campagne'], 404);
        }

        $creator = $em->getRepository(CreatorProfil::class)->findOneBy(['user' => $user]);

        if (!$creator) {
            $creator = new CreatorProfil();
        }

        /* TRAITEMENTS */
        try {
            $campagne = new Campagne();

            // Téléchargement d'un fichier PDF envoyé dans la demande vers un répertoire spécifié sur le serveur
            /** @var UploadedFile $uploadedFile */
            $fileSource = $request->files->get('file');
            $extension = pathinfo($fileSource->getClientOriginalName(), PATHINFO_EXTENSION);
            $originalFilename = pathinfo($fileSource->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid();
            $newFilenamePdf = $newFilename.'.'.$extension;
            $newFilenamePng = $newFilename.'.png';

            $fsObject = new Filesystem();
            $current_dir_path = getcwd();
            $new_dir_path = $this->getParameter('campagnes_dir').'/'.$user->getId();

            if (!$fsObject->exists($new_dir_path)) {
                $fsObject->mkdir($new_dir_path, 0775);
            }

            try {
                $fileSource->move(
                    $new_dir_path,
                    $newFilenamePdf
                );
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Error'], 500);
            }

            $campagne->setFileSource($newFilename);

            // Conversion du PDF en image PNG.
            $outputImagePath = $this->getParameter('campagnes_dir').'/'.$user->getId().'/'.$newFilenamePng;
            $pdf = new Pdf($new_dir_path.'/'.$newFilenamePdf);
            $pdf->setOutputFormat('png')
                    ->setResolution(60)
                    ->saveImage($outputImagePath);

            // Vérifier si le format du PDF est A2
            if (!$this->isPdfA2Format($new_dir_path.'/'.$newFilenamePdf)) {
                return new JsonResponse(['error' => 'Le format du PDF doit être A2.'], 400);
            }

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

            // Définition du poids, du style de papier et de la taille de la campagne.
            $weight = $em->getRepository(PaperWeight::class)->findOneBy(['weight' => $request->request->get('weight')], []);
            $campagne->setWeight($weight);
            $paper = $em->getRepository(PaperStyle::class)->findOneBy(['name' => $request->request->get('paper')], []);
            $campagne->setPaper($paper);
            $size = $em->getRepository(PaperSize::class)->findOneBy(['name' => $request->request->get('size')], []);
            $campagne->setSize($size);

            // Fixer le prix de la campagne en fonction du poids et de la taille
            if ($request->request->get('weight') == '130') {
                if ($request->request->get('size') == 'A2') {
                    $pricePrint = 6;
                } elseif ($request->request->get('size') == 'A3') {
                    $pricePrint = 4;
                } else {
                    $pricePrint = 2.50;
                }
            } elseif ($request->request->get('weight') == '160') {
                if ($request->request->get('size') == 'A2') {
                    $pricePrint = 8;
                } elseif ($request->request->get('size') == 'A3') {
                    $pricePrint = 4;
                } else {
                    $pricePrint = 2.50;
                }
            }

            // Définir le nom, la description, la taxe totale, le prix après taxe et le statut de la campagne etc..
            $campagne->setPricePrint($pricePrint);
            $campagne->setNameProject($request->request->get('projectName'));
            $campagne->setPrice($request->request->get('price'));
            $campagne->setDescription($request->request->get('description'));
            $campagne->setTotalTax($request->request->get('totalTax'));
            $campagne->setPriceAti($request->request->get('totalPrice') + $pricePrint);
            $campagne->setStatus($em->getRepository(CampagneStatus::class)->findOneBy(['id' => 1], []));
            $campagne->setIsBest(false);
            $campagne->setUser($user);
            $campagne->setCreatedAt(new \DateTimeImmutable());
            $user->setRoles(['ROLE_CREATOR', 'ROLE_USER']);
            $em->persist($campagne);
            $em->persist($user);
            $creator->setUser($user);
            $em->persist($creator);
            $em->flush();

            // $user->setAddress($address);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'Error form'], 404);
        }

        // Log
        $LogServices->createLog($user, 'Une nouvelle campagne '.$campagne->getId().' a été crée par '.$user->getEmail(), 'CAMPAGNE');
        $LogServices->createCampagneLog($campagne, 'Campagne crée', 'CAMPAGNE_CREATE');

        // Email
        $emailService->sendEmail(
            'emails/campagn-submitted.html.twig',
            [
                'campagne' => $campagne,
            ],
            $user->getEmail(),
            'Your campaign has been successfully submitted !'
        );

        // Log
        $LogServices->createLog($user, 'Un email de confirmation a été envoyé pour la campagne '.$campagne->getId().' à '.$user->getEmail(), 'CAMPAGNE');

        // Envoi d'une réponse de succès
        return new JsonResponse(['message' => 'Campagne add successfully'], 201);
    }

    /**
     * Il s'agit d'une fonction qui affiche la liste des campagnes pour un créateur.
     *
     * @param entityManagerInterface $em:         une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param JWTEncoderInterface    $jwtEncoder: une instance de la JWTEncoderInterfaceclasse, utilisée pour décoder le JSON Web Token (JWT) envoyé dans l'en-tête de la requête pour authentifier l'utilisateur
     * @param request                $request:    une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/account/campagne/list', name: 'app_campagne_account_list')]
    public function campagneList(EntityManagerInterface $em, JWTEncoderInterface $jwtEncoder, Request $request)
    {
        /* DATA */
        $token = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $token);

        // Récupère d'abord le JWT à partir de l'en-tête de la demande et le décode pour obtenir l'e-mail de l'utilisateur. Il récupère ensuite l'objet utilisateur de la base de données à l'aide de l'e-mail.
        try {
            $data = $jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            return new JsonResponse(['error' => 'You should to be connect for post campagne'], 401);
        }
        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        // Si l'utilisateur n'existe pas, la fonction renvoie une réponse d'erreur 404.
        if (!$user) {
            return new JsonResponse(['error' => 'You should to be connect for post campagne'], 404);
        }

        // Récupère les campagnes en fonction de l'utilisateur connecté
        $campagnes = $em->getRepository(Campagne::class)->findBy(['user' => $user]);

        $data = [];

        foreach ($campagnes as $campagne) {
            $createdAt = ($campagne->getCreatedAt() !== null) ? $campagne->getCreatedAt()->format('Y-m-d') : '';
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));
            $benefCreator = $campagne->getTotalBenefCreator() ?? null;

            $nbvente = 0;
            foreach ($campagne->getCampagneOrders() as $key => $campagneOrder) {
                if ($campagneOrder->getPurchase()->getStatus() == 'paid') {
                    $nbvente = $campagneOrder->getQuantity() + $nbvente;
                }
            }

            $data[] = [
               'id' => $campagne->getId(),
               'roles' => $campagne->getUser()->getRoles(),
               'userid' => $campagne->getUser()->getId(),
               'name' => $campagne->getUser()->getFirstName().' '.$campagne->getUser()->getLastName(),
               'filename' => $campagne->getFileSource(),
               'nameproject' => $campagne->getNameProject(),
               'ncommande' => $campagne->getNumCommande(),
               'price' => $campagne->getPrice(),
               'paper' => $campagne->getPaper()->getName(),
               'size' => $campagne->getSize()->getName(),
               'weight' => $campagne->getWeight()->getWeight(),
               'days' => $days,
               'fileSource' => $campagne->getFileSource().'.png',
               'filename' => $campagne->getFileSource().'.pdf',
               'status' => $campagne->getStatus()->getLibelle(),
               'createdAt' => $createdAt,
               'benefCreator' => $benefCreator,
               'nbvente' => $nbvente ?? null,
           ];
        }

        return new JsonResponse(['campagnes' => array_reverse($data)], 201);
    }

    /**
     * Il s'agit d'une fonction qui affiche le détail d'un profil créateur.
     *
     * @param entityManagerInterface $em:      une instance de la EntityManagerInterfaceclasse, utilisée pour conserver les données dans la base de données
     * @param                        $id:      id du creator
     * @param request                $request: une instance de la classe Request, qui contient des informations sur la requête HTTP
     */
    #[Route('/api/creator/detail/{id}', name: 'app_creator_detail')]
    public function getCreatorDetail(EntityManagerInterface $em, string $id, Request $request)
    {
        $creator = $em->getRepository(CreatorProfil::class)->find($id);

        if (!$creator || !$id) {
            return new JsonResponse(['error' => ''], 404);
        }

        $campagnes = $creator->getUser()->getCampagnes();

        $campagnesData = [];
        foreach ($campagnes as $c) {
            $createdAt = ($c->getCreatedAt() !== null) ? $c->getCreatedAt()->format('Y-m-d') : '';
            $today = date('Y-m-d');
            $diff = abs(strtotime($today) - strtotime($createdAt));
            $days = floor($diff / (60 * 60 * 24));
            $campagnesData[] = [
                    'id' => $c->getId(),
                    'userid' => $c->getUser()->getId(),
                    'nameproject' => $c->getNameProject(),
                    'slug' => $c->getSlug(),
                    'status' => $c->getStatus()->getLibelle(),
                    'fileSource' => $c->getFileSource().'.png',
                    'filename' => $c->getFileSource(),
                    'price' => $c->getPriceAti(),
                    'days' => $days,
                ];
        }
        // Filtrer les campagnes en fonction du statut
        $enCoursCampagnes = array_filter($campagnesData, function ($c) {
            return $c['status'] === 'En cours';
        });

        $name = ($creator->getDisplayName() !== null) ? $creator->getDisplayName() : $creator->getUser()->getFirstName().' '.$creator->getUser()->getLastName();
        $data = [
            'id' => $creator->getId(),
            'fileSource' => $creator->getFilename(),
            'name' => $name,
            'bio' => $creator->getBio() ?? '',
            'instagram' => $creator->getInstagram() ?? '',
            'linkedin' => $creator->getLinkedin() ?? '',
            'dribble' => $creator->getDribble() ?? '',
            'behance' => $creator->getBehance() ?? '',
            'campagnes' => array_reverse($enCoursCampagnes),
         ];

        return new JsonResponse(['creator' => array_reverse($data)], 201);
    }

    /**
     * Vérifier si le format du PDF est A2.
     *
     * @param string $pdfPath Chemin du fichier PDF
     *
     * @return bool True si le format est A2, sinon False
     */
    private function isPdfA2Format(string $pdfPath): bool
    {
        $pdf = new Pdf($pdfPath);
        // Check le DPI
        // Si inférieur à 300 renvoyé une erreur
        // Si ok check si le width et le height correspond
        // 4 961 x 7 016 px
        dd($pdf->imagick->getImageWidth(), $pdf->imagick->getImageHeight(), $pdf->imagick->getImageResolution());
        $size = $pdf->getPageSize();

        // Comparer la taille du PDF avec le format A2
        return $size['width'] === 420 && $size['height'] === 594;
    }
}
