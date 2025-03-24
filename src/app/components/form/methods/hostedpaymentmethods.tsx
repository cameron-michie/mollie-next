import {
    Card,
    Flex,
    Separator,
    Text,
    Switch,
    RadioCards,
} from '@radix-ui/themes';

import React from 'react';

import PaymentLogo from '@/app/components/form/paymentlogo';

import { mollieGetMethods } from '@/app/lib/mollie';

export default async function HostedPaymentMethodCards({
    currency,
    country,
}: {
    currency?: string;
    country?: string;
}) {
    const methods = await mollieGetMethods(currency, country);
    console.log("Hosted methods recalled from api: ", methods);
    return (
        <>
            <Card m="1">
                <RadioCards.Root
                    defaultValue={methods[0]?.id}
                    name="payment_method"
                    columns={{ initial: '1', sm: '2' }}
                    size={{ initial: '1', sm: '2' }}
                    mb="3"
                >
                    {methods.map((method) => (
                        <React.Fragment key={method.id}>
                            <RadioCards.Item
                                value={method.id}
                                aria-label={method.description}
                            >
                                <PaymentLogo method={method.id} />
                                <Text>{method.description}</Text>
                            </RadioCards.Item>
                        </React.Fragment>
                    ))}
                </RadioCards.Root>
                <Separator
                    my="3"
                    size="4"
                />
                <Flex>
                    <Text
                        as="label"
                        size="2"
                    >
                        <Flex
                            gap="2"
                            direction="column"
                        >
                            <Flex gap="2">
                                <Switch
                                    radius="full"
                                    name="captureMode"
                                    value={'manual'}
                                    aria-label="Capture mode"
                                />
                                Authorize payment (Cards and Klarna only)
                            </Flex>
                            <Text
                                size="1"
                                color="gray"
                            >
                                Authorized payments need to be captured later
                            </Text>
                        </Flex>
                    </Text>
                </Flex>
            </Card>
        </>
    );
}
