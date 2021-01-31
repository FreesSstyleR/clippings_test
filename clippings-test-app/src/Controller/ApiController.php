<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface as ValidatorValidatorInterface;
use App\Util\Helpers;

class ApiController extends AbstractController
{
    /*
     * @Route("/api/csvform", name="csvform")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function submit_form(Request $request, ValidatorValidatorInterface $validator, Helpers $helpers)
    {
        $response = new Response();
        $data = json_decode($request->getContent(), true);
        $errors = [];

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $constraints = new Assert\Collection([
            'csvData' => new Assert\All([
                new Assert\Collection([
                    'customer' => [new Assert\NotBlank()],
                    'vat_number' => [new Assert\NotBlank()],
                    'document_number' => [new Assert\NotBlank()],
                    'type' => [new Assert\NotBlank()],
                    'parent_document' => [new Assert\Optional()],
                    'currency' => [new Assert\NotBlank()],
                    'total' => [new Assert\NotBlank(), new Assert\Positive()],
                ])
            ]),
            'currencies' => new Assert\Collection([
                'USD' => [new Assert\NotBlank(), new Assert\Positive()],
                'EUR' => [new Assert\NotBlank(), new Assert\Positive()],
                'GBP' => [new Assert\NotBlank(), new Assert\Positive()],
            ]),
            'output_currency' =>  [new Assert\NotBlank()],
            'filter_customer' => [new Assert\Optional()],
        ]);

        $violiations = $validator->validate($data, $constraints);
        $unique_child_documents = $helpers->uniqueChildDocuments($data['csvData']);
        if (count($violiations) > 0 || count($unique_child_documents) > 0) {
            foreach ($violiations as $violation) {
                $errors[$violation->getPropertyPath()] =  $violation->getMessage() . "<br/>";
            }

            foreach ($unique_child_documents as $unique) {
                $errors[$unique] = "Parent document does not exists";
            }

            $response->setStatusCode(400);
            $response->setContent(json_encode($this->format("Invalid data", null, $errors)));
            return $response;
        }

        foreach ($data['currencies'] as $key => $value) {
            if ($value == 1) {
                $this->default_currency = $key;
            }
        }

        $helpers->setCurrencies($data['currencies'], $data['output_currency']);

        $customer_data = $data['csvData'];
        $customers = array();

        if (!empty($data['filter_customer'])) {
            $customers[$data['filter_customer']] = $helpers->filterByCustomer($customer_data, $data['filter_customer']);
        } else {
            $customers = $helpers->groupByCustomer($customer_data);
        }

        $total = $helpers->calculate($customers);

        $response->setStatusCode("200");
        $response->setContent(json_encode($total));

        return $response;
    }

    private function format(string $message, $data = null, array $errors = [])
    {
        if ($data == null) {
            $data = new \ArrayObject();
        }

        $response_data = [
            'message' => $message,
            'data'    => $data,
        ];
        if ($errors) {
            $response_data['errors'] = $errors;
        }

        return $response_data;
    }
}
