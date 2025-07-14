import { NextRequest, NextResponse } from "next/server";
import { createConnectAccount, createAccountLink } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { sellerEmail } = await req.json();

    if (!sellerEmail) {
      return NextResponse.json(
        { error: "Seller email is required" },
        { status: 400 }
      );
    }

    const account = await createConnectAccount(sellerEmail);

    const accountLink = await createAccountLink(
      account.id,
      `${req.headers.get("origin")}/connect/refresh`,
      `${req.headers.get("origin")}/connect/return`
    );

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: accountLink.url,
    });
  } catch (error: unknown) {
    console.error("Connect account creation error:", error);
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
