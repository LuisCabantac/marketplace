import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const {
      price,
      title,
      listingId,
      sellerEmail,
      buyerEmail,
      stripeAccountId,
    } = await req.json();
    const origin = req.headers.get("origin") || "";
    const successUrl = `${origin}/payment/success`;
    const cancelUrl = `${origin}/item/${listingId}`;

    const session = await createCheckoutSession({
      price,
      title,
      listingId,
      sellerEmail,
      buyerEmail,
      successUrl,
      cancelUrl,
      stripeAccountId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Session error:", error);
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
