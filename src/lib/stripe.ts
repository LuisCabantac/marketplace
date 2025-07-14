import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(stripeSecretKey);

export async function createCheckoutSession({
  price,
  title,
  listingId,
  sellerEmail,
  buyerEmail,
  successUrl,
  cancelUrl,
  stripeAccountId,
}: {
  price: number;
  title: string;
  listingId: string;
  sellerEmail: string;
  buyerEmail: string;
  successUrl: string;
  cancelUrl: string;
  stripeAccountId?: string;
}) {
  const amount = Math.round(price * 100);

  const sessionData: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      listingId,
      sellerEmail,
      buyerEmail,
    },
  };

  if (stripeAccountId) {
    sessionData.payment_intent_data = {
      application_fee_amount: Math.round(amount * 0.1),
      transfer_data: {
        destination: stripeAccountId,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionData);
  return session;
}

export async function createConnectAccount(sellerEmail: string) {
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    email: sellerEmail,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    business_profile: {
      url: "https://marketplace-john-luis.vercel.app",
      mcc: "5734",
    },
  });

  return account;
}

export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return accountLink;
}

export async function getConnectAccount(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  return account;
}

export function verifyStripeSignature(
  request: Buffer | string,
  signature: string,
  endpointSecret: string
) {
  return stripe.webhooks.constructEvent(request, signature, endpointSecret);
}
