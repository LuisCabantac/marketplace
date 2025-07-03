import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/messages - Get messages for a listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listing_id = searchParams.get("listing_id");
    const buyer_email = searchParams.get("buyer_email");
    const seller_email = searchParams.get("seller_email");

    if (!listing_id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Build query based on provided parameters
    let query = supabase
      .from("messages")
      .select("*")
      .eq("listing_id", listing_id)
      .order("created_at", { ascending: true });

    // Filter by specific conversation if both emails provided
    if (buyer_email && seller_email) {
      query = query.or(
        `and(buyer_email.eq.${buyer_email},seller_email.eq.${seller_email}),and(buyer_email.eq.${seller_email},seller_email.eq.${buyer_email})`
      );
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listing_id, buyer_email, seller_email, message } = body;

    // Validate required fields
    if (!listing_id || !buyer_email || !seller_email || !message) {
      return NextResponse.json(
        {
          error:
            "Listing ID, buyer email, seller email, and message are required",
        },
        { status: 400 }
      );
    }

    // Validate message content
    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message content cannot exceed 1000 characters" },
        { status: 400 }
      );
    }

    // Validate that the listing exists
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_email")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Ensure the seller_email matches the listing
    if (listing.seller_email !== seller_email) {
      return NextResponse.json(
        { error: "Seller email does not match listing" },
        { status: 400 }
      );
    }

    // Create the message
    const { data: newMessage, error } = await supabase
      .from("messages")
      .insert([
        {
          listing_id,
          buyer_email,
          seller_email,
          message: message.trim(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating message:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
