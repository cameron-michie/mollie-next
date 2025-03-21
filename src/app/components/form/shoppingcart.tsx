'use client';

import { Flex, Heading, Text, Card, Table, Select } from '@radix-ui/themes';
import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { Product } from '@/app/lib/types';

// Currency symbols
const CURRENCY_SYMBOLS = {
    EUR: '€',
    SEK: 'kr',
    GBP: '£',
    USD: '$',
    CHF: 'fr',
};

interface ShoppingCartProps {
    items?: Product[];
}

export default function ShoppingCart({ items = [] }: ShoppingCartProps) {
    const [currency, setCurrency] = useState('EUR');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Check if currency is in the URL
    const urlCurrency = searchParams.get('currency');
    if (urlCurrency && urlCurrency !== currency) {
        setCurrency(urlCurrency);
    }

    // when the currency changes, store it in the URL
    // and update the state
    function handleCurrencyChange(currency: string) {
        setCurrency(currency);
        const params = new URLSearchParams(searchParams);
        if (currency) {
            params.set('currency', currency);
        } else {
            params.delete('currency');
        }
        replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }

    // Format price with the selected currency symbol
    const formatPrice = (price: number) => {
        const symbol =
            CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS];

        // Format based on currency style
        if (currency === 'GBP' || currency === 'USD') {
            return `${symbol}${price.toFixed(2).replace('.', ',')}`;
        } else {
            return `${price.toFixed(2).replace('.', ',')} ${symbol}`;
        }
    };

    // Calculate total
    const total = items.reduce(
        (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
        0
    );

    return (
        <>
            <Flex
                justify="between"
                align="center"
            >
                <Heading size="3">Your Shopping Cart</Heading>
                <Select.Root
                    value={currency}
                    onValueChange={handleCurrencyChange}
                    name="currency"
                    aria-label="Select currency"
                    defaultValue="EUR"
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="EUR">EUR (€)</Select.Item>
                        <Select.Separator />
                        <Select.Item value="SEK">SEK (kr)</Select.Item>
                        <Select.Item value="GBP">GBP (£)</Select.Item>
                        <Select.Item value="USD">USD ($)</Select.Item>
                        <Select.Item value="CHF">CHF (fr)</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>

            <Card m="1">
                <Flex direction="column">
                    <Table.Root>
                        <Table.Body>
                            <Table.Row>
                                <Table.ColumnHeaderCell>
                                    Product
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Quantity
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>
                                    Price
                                </Table.ColumnHeaderCell>
                            </Table.Row>

                            {items.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <Flex direction="column">
                                            <Text>{item.name}</Text>
                                            <Text
                                                size="1"
                                                color="gray"
                                            >
                                                {item.description}
                                            </Text>
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell>{item.quantity || 1}</Table.Cell>
                                    <Table.Cell>
                                        {formatPrice(parseFloat(item.price) * (item.quantity || 1))}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                    <Flex
                        align="center"
                        justify="center"
                        gap="2"
                        m="3"
                    >
                        <Heading size="2">Total</Heading>
                        <Heading size="2">{formatPrice(total)}</Heading>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
}
