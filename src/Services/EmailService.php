<?php

namespace App\Services;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendEmail(string $template, array $params, string $to, string $subject)
    {
        $email = (new TemplatedEmail())
            ->from('no-reply@shareprint.com')
            ->to($to)
            ->subject($subject)
            ->htmlTemplate($template)
            ->context($params);

        $this->mailer->send($email);
    }
}
