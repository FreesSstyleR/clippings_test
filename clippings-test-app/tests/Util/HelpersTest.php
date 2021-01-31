<?php

namespace App\Tests\Util;

use PHPUnit\Framework\TestCase;
use App\Util\Helpers;

class HelpersTest extends TestCase
{
    const CURRENCIES = [
        'USD' => 1.23,
        'EUR' => 1,
        'GBP' => 1.34,

    ];
    const OUTPUT_CURRENCY = "USD";

    const CORRECT_DATA = [
        [
            "customer" => "Vendor 1",
            "vat_number" => 123456789,
            "document_number" => 1000000257,
            "type" => 1,
            "parent_document" => null,
            "currency" => "USD",
            "total" => 400,
        ], [
            "customer" => "Vendor 2",
            "vat_number" => 987654321,
            "document_number" => 1000000258,
            "type" => 1,
            "parent_document" => null,
            "currency" => "EUR",
            "total" => 900,
        ], [
            "customer" => "Vendor 3",
            "vat_number" => 123465123,
            "document_number" => 1000000259,
            "type" => 1,
            "parent_document" => null,
            "currency" => "GBP",
            "total" => 1300,
        ], [
            "customer" => "Vendor 1",
            "vat_number" => 123456789,
            "document_number" => 1000000260,
            "type" => 2,
            "parent_document" => 1000000257,
            "currency" => "EUR",
            "total" => 100,
        ]
    ];

    const MISSING_PARENT_DATA = [
        [
            "customer" => "Vendor 1",
            "vat_number" => 123456789,
            "document_number" => 1000000257,
            "type" => 1,
            "parent_document" => null,
            "currency" => "USD",
            "total" => 400,
        ], [
            "customer" => "Vendor 2",
            "vat_number" => 987654321,
            "document_number" => 1000000258,
            "type" => 1,
            "parent_document" => null,
            "currency" => "EUR",
            "total" => 900,
        ], [
            "customer" => "Vendor 3",
            "vat_number" => 123465123,
            "document_number" => 1000000259,
            "type" => 1,
            "parent_document" => null,
            "currency" => "GBP",
            "total" => 1300,
        ], [
            "customer" => "Vendor 1",
            "vat_number" => 123456789,
            "document_number" => 1000000260,
            "type" => 2,
            "parent_document" => 100000025712,
            "currency" => "EUR",
            "total" => 100,
        ]
    ];

    public function testCalculateResult()
    {
        $helper = new Helpers();
        $helper->setCurrencies(self::CURRENCIES, self::OUTPUT_CURRENCY);

        $grouped = $helper->groupByCustomer(self::CORRECT_DATA);
        $output = $helper->calculate($grouped);
        $expected_output = [
            "Vendor 1" => 277,
            "Vendor 2" => 1107,
            "Vendor 3" => 1193.284
        ];

        $this->assertTrue(!$this->compareArray($expected_output, $output));
    }

    public function testMissingParent()
    {
        $helper = new Helpers();
        $expected_output = [
            3 => 100000025712
        ];
        $output = $helper->uniqueChildDocuments(self::MISSING_PARENT_DATA);

        $this->assertTrue(!$this->compareArray($expected_output, $output));
    }

    private function compareArray($a, $b)
    {
        return count(array_diff_assoc($a, $b)) > 0;
    }
}
