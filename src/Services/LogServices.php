<?php
namespace App\Services;

use App\Entity\UserLog;
use Doctrine\ORM\EntityManagerInterface;

class LogServices
{
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    public function createLog($user, string $message, string $code)
    {
        $log = new UserLog();
        $log->setMessage($message);
        $log->setUser($user);
        $log->setCode($code);
        $this->manager->persist($log);
        $this->manager->flush();
    }
}