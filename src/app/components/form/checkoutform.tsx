'use client';

// UI
import { Flex, Grid, Heading } from '@radix-ui/themes';

// React Types
import React from 'react';

// Lib
import { CheckoutVariant } from '@/app/lib/types';
import { useCart } from '@/app/lib/CartContext';

// Client Components
import CheckoutButton from './checkoutbutton';
import MethodSwitch from './methods/switch';
import ShoppingCart from './shoppingcart';

// This is the main checkout form component

// It takes the address and payment methods as props
// The form itself is a client component (to make use of client-side JavaScript), but the address and payment methods are server components
// The form is submitted to the createPayment function when the CheckoutButton is clicked

interface CheckoutFormProps {
    address: React.ReactNode;
    hostedmethods: React.ReactNode;
}

export default function CheckoutForm({
    address,
    hostedmethods,
}: CheckoutFormProps) {
    const { items } = useCart();
    // Use React State to switch between hosted and component payment methods
    const [checkoutVariant, setCheckoutVariant] =
        React.useState<CheckoutVariant>('hosted');

    if (items.length === 0) {
        return (
            <Flex direction="column" m="6" align="center" justify="center">
                <Heading mb="4">Your cart is empty</Heading>
                <p className="text-gray-600 dark:text-gray-400">Add some items to your cart to proceed with checkout.</p>
            </Flex>
        );
    }

    return (
        // The form data is sent to the createPayment function when the form is submitted
        <form>
            <Flex
                direction="column"
                m="6"
            >
                <Heading mb="4">Checkout</Heading>

                <Grid
                    pt="2"
                    columns={{
                        initial: '1',
                        md: '2',
                    }}
                    gap="5"
                    gapY="6"
                >
                    {address}
                    <Flex
                        direction="column"
                        gap="2"
                    >
                        <ShoppingCart items={items} />
                        <Heading
                            size="3"
                            mt="2"
                        >
                            Payment
                        </Heading>
                        <MethodSwitch
                            variant={checkoutVariant}
                            hostedmethods={hostedmethods}
                            onClick={() =>
                                setCheckoutVariant((prev) =>
                                    prev === 'hosted' ? 'components' : 'hosted'
                                )
                            }
                        />
                    </Flex>
                </Grid>
                <Flex
                    align="center"
                    justify="center"
                    mt="6"
                >
                    <CheckoutButton variant={checkoutVariant} />
                </Flex>
            </Flex>
        </form>
    );
}
