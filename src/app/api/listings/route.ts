import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/listings - Fetch all listings with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%, description.ilike.%${search}%`
      );
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: listings, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
      return NextResponse.json(
        { error: "Failed to fetch listings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ listings, count: listings?.length || 0 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      location,
      image_url,
      seller_email,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !location ||
      !seller_email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate price is a positive number
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Validate category is one of the allowed values
    const allowedCategories = [
      "vehicles",
      "property-rentals",
      "apparel",
      "electronics",
      "classifieds",
      "entertainment",
      "family",
      "free-stuff",
      "garden-outdoor",
      "hobbies",
      "home-goods",
      "home-improvement",
      "home-sales",
      "musical-instruments",
      "office-supplies",
      "pet-supplies",
      "sporting-goods",
      "toys-games",
      "buy-sell-groups",
    ];

    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Create the listing
    const { data: listing, error } = await supabase
      .from("listings")
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category,
          location: location.trim(),
          seller_email,
          image_url,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating listing:", error);
      return NextResponse.json(
        { error: "Failed to create listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
