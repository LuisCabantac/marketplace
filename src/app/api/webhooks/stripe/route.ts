import { NextRequest, NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature") || "";
  const buf = await req.arrayBuffer();
  let event;

  try {
    event = verifyStripeSignature(Buffer.from(buf), signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const listingId = session.metadata?.listingId;
    const buyerEmail = session.metadata?.buyerEmail;
    const amount = session.amount_total ? session.amount_total / 100 : null;

    const { error: orderError } = await supabase.from("orders").insert([
      {
        listing_id: listingId,
        stripe_session_id: session.id,
        buyer_email: buyerEmail,
        amount,
        payment_status: "paid",
      },
    ]);

    if (orderError) {
      console.error("Failed to insert order:", orderError);
    } else {
      const { data: fdwStats, error: statsError } = await supabase
        .from("wrappers_fdw_stats")
        .select("*")
        .eq("fdw_name", "stripe_wrapper")
        .single();
      if (statsError) {
        console.error("Failed to fetch FDW stats:", statsError);
      } else {
        console.log("Stripe FDW stats at order creation:", fdwStats);
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
