<?php

namespace App\Util;

class Helpers
{
    public $currencies;

    public $output_currency;

    public function setCurrencies($currencies, $output_currency)
    {
        $this->currencies = $currencies;
        $this->output_currency = $output_currency;
    }

    public function uniqueChildDocuments($array)
    {
        $unique_parent = array_unique(array_column($array, 'document_number'));
        $unique_child = array_filter(array_unique(array_column($array, 'parent_document')));

        return array_diff($unique_child, $unique_parent);
    }

    public function groupByCustomer($data)
    {
        $filter = array();
        foreach ($data as $customer) {
            $filter[$customer['customer']][] = $customer;
        }
        return $filter;
    }

    public function filterByCustomer($data, $filter)
    {
        return array_filter($data, function ($value) use ($filter) {
            return $value['customer'] == $filter;
        });
    }

    public function convert($amount, $input_currency)
    {
        return ($amount / $this->currencies[$input_currency]) * $this->currencies[$this->output_currency];
    }

    public function calculate($customers)
    {
        $response = array();
        $sum = 0;

        foreach ($customers as $customer => $customer_data) {
            $sum = 0;
            foreach ($customer_data as $values) {
                if ($values['type'] != 2) {
                    $sum += $this->convert($values['total'], $values['currency']);
                } else {
                    $sum -= $this->convert($values['total'], $values['currency']);
                }
            }

            $response[$customer] = round($sum, 3);
        }

        return $response;
    }
}
