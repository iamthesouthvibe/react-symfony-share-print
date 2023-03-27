<?php

namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;

class PdfService
{
    private $domPdf;

    public function __construct()
    {
        $this->domPdf = new DomPdf();

        $pdfOptions = new Options();

        $pdfOptions->set('defaultFont', 'Garamond');

        $this->domPdf->setOptions($pdfOptions);
    }

    public function showPdfFile($html)
    {
        $this->domPdf->loadHtml($html);
        $this->domPdf->render();
        $this->domPdf->stream('orders_print.pdf', [
            'Attachement' => true,
        ]);
    }

    public function savePdfFile($html, $filePath, $fileName)
    {
        $this->domPdf->loadHtml($html);
        $this->domPdf->render();

        $pdfContent = $this->domPdf->output();

        // $filePath = $this->getParameter('print_dir').$fileName;
        file_put_contents($filePath.'/'.$fileName, $pdfContent);

        // return $filePath;
    }

    public function generateBinaryPDF($html)
    {
        $this->domPdf->loadHtml($html);
        $this->domPdf->render();
        $this->domPdf->output();
    }
}
