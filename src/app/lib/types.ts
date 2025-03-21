import { ReactNode } from 'react';
import { CaptureMethod, PaymentMethod } from '@mollie/api-client';

// Product types
export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    quantity?: number;
}

// Mollie Context types
export type MollieInstance = {
    createComponent: (type: string) => {
        mount: (selector: string) => void;
        unmount: () => void;
    };
    createToken: () => Promise<{ token: string; error?: string }>;
};

export type MollieContextType = {
    mollie: MollieInstance | null;
};

export type MollieProviderProps = {
    children: ReactNode;
};

// Mollie payment form types
export type CreatePaymentParams = {
    firstname: string;
    lastname: string;
    company?: string;
    email: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    payment_method: PaymentMethod;
    cardToken?: string;
    captureMode?: CaptureMethod;
    currency: string;
};

// Checkout types
export type CheckoutVariant = 'hosted' | 'components';
