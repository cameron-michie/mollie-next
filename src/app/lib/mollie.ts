'use server';

import createMollieClient, {
    Locale,
    Payment,
    SequenceType,
    PaymentLineCategory,
} from '@mollie/api-client';
import { CreatePaymentParams } from './types';

const apiKey = process.env.MOLLIE_API_KEY;
const domain = process.env.DOMAIN || 'http://localhost:3000';
const webhookUrl = process.env.WEBHOOK_URL || 'http://not.provided';

if (!apiKey) {
    throw new Error('MOLLIE_API_KEY is not defined');
}

// Set up Mollie API client
const mollieClient = createMollieClient({ apiKey: apiKey });

// translate countries to locales
const countryToLocale: Record<string, Locale> = {
    DE: Locale.de_DE,
    AT: Locale.de_AT,
    NL: Locale.nl_NL,
    UK: Locale.en_US,
    SE: Locale.sv_SE,
    PT: Locale.pt_PT,
    IT: Locale.it_IT,
};

// function to get the locale for a given country
function getLocaleForCountry(country: string): Locale {
    let locale = countryToLocale[country];
    if (!locale) {
        locale = Locale.en_US; // default to English if country is not found
    }
    return locale;
}

// Create a payment using data gathered from the checkout form
export async function mollieCreatePayment({
    firstname,
    lastname,
    company,
    email,
    address,
    city,
    zip_code,
    country,
    payment_method,
    cardToken,
    captureMode,
    currency,
}: CreatePaymentParams) {
    // we need to construct the billingAdress object first as long as this isn't fixed:
    // https://github.com/mollie/mollie-api-node/issues/390#issuecomment-2467604847
    // Update 2025-03-04: The original issue is fixed, but organizationName is still not supported
    // https://github.com/mollie/mollie-api-node/issues/410
    const billingAddress = {
        givenName: firstname,
        familyName: lastname,
        organizationName: company,
        streetAndNumber: address,
        postalCode: zip_code,
        city: city,
        country: country,
        email: email,
    };

    // set up the actual payment with mollie library
    const payment: Payment = await mollieClient.payments.create({
        amount: {
            currency: currency,
            value: '220.00',
        },
        metadata: {
            internal_payment_id: 'mollie-next-' + Date.now(),
        },
        lines: [
            {
                description: 'An expensive product',
                quantity: 1,
                unitPrice: {
                    currency: currency,
                    value: '200.00',
                },
                totalAmount: {
                    currency: currency,
                    value: '200.00',
                },
            },
            {
                description: 'A cheap product',
                quantity: 1,
                unitPrice: {
                    currency: currency,
                    value: '10.00',
                },
                totalAmount: {
                    currency: currency,
                    value: '10.00',
                },
                // categories for voucher payments
                categories: [PaymentLineCategory.gift, PaymentLineCategory.eco],
            },
            {
                description: 'Another cheap product',
                quantity: 1,
                unitPrice: {
                    currency: currency,
                    value: '10.00',
                },
                totalAmount: {
                    currency: currency,
                    value: '10.00',
                },
                // categories for voucher payments
                categories: [PaymentLineCategory.gift, PaymentLineCategory.eco],
            },
        ],
        description: 'Demo payment from ' + firstname,
        redirectUrl: domain + '/success',
        cancelUrl: domain,
        webhookUrl: webhookUrl,
        method: payment_method,
        ...{ billingAddress },
        cardToken: cardToken,
        captureMode: captureMode,
        locale: getLocaleForCountry(country),
    });
    const redirectUrl = payment.getCheckoutUrl();
    return redirectUrl;
}

// Get the last 10 payments made

export async function mollieGetPayments() {
    const payments = await mollieClient.payments.page({ limit: 10 });
    return payments;
}

// Get a specific payment by its ID

export async function mollieGetPayment(id: string) {
    const payment = await mollieClient.payments.get(id);
    return payment;
}

// Get the available payment methods in the checkout
// we're passing some additional info like sequencetype, locale and amount
// this way we can filter the available payment methods.

export async function mollieGetMethods(
    currency: string = 'EUR',
    country: string = 'DE'
) {
    let locale = Locale.en_US;
    locale = getLocaleForCountry(country);
    const methods = await mollieClient.methods.list({
        sequenceType: SequenceType.oneoff,
        locale: locale,
        resource: 'payments',
        amount: { currency: currency, value: '220.00' },
    });
    return methods;
}
// Capture a payment in full

export async function mollieCapturePayment(id: string) {
    console.log('Capturing payment with id: ' + id);
    const capture = await mollieClient.paymentCaptures.create({
        paymentId: id,
    });
    return capture;
}

export async function mollieCreateSession() {
    const session = await fetch('https://api.mollie.com/v2/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
            amount: {
                value: '10.00',
                currency: 'EUR',
            },
        }),
    });

    const { id, clientAccessToken } = await session.json();
    console.log('Session created with id: ' + id);
    console.log('Client access token: ' + clientAccessToken);

    return { sessionId: id, clientAccessToken: clientAccessToken };
}

export async function mollieCreateSessionPayment(sessionId: string) {
    const payment = await fetch(
        `https://api.mollie.com/v2/sessions/${sessionId}/payments`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: JSON.stringify({
                description: 'Test Express Payment',
                amount: {
                    value: '10.00',
                    currency: 'EUR',
                },
                redirectUrl: domain + '/success',
            }),
        }
    );
    if (!payment.ok) {
        console.error(payment);
        throw new Error('Failed to create session payment');
    } else {
        return payment;
    }
}
