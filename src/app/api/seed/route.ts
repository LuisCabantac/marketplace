import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sampleListings = [
  {
    title:
      "Alex Estala Rookie Topps Royalty Game Worn Relic Tennis Card. Numbered /5...",
    description:
      "Rare tennis card from Alex Estala's rookie collection. Game-worn relic included. Limited edition numbered to only 5 pieces worldwide.",
    price: 110000,
    category: "Entertainment",
    seller_email: "collector@example.com",
    location: "Manila, NCR",
    image_url: null,
  },
  {
    title: "2006 Porsche Boxster",
    description:
      "Well-maintained Porsche Boxster in excellent condition. Regular maintenance, clean title. Perfect for weekend drives.",
    price: 1600000,
    category: "Vehicles",
    seller_email: "cardealer@example.com",
    location: "Marikina, NCR",
    image_url: null,
  },
  {
    title: "PHP Programming Course Materials",
    description:
      "Complete PHP programming course with books, exercises, and project files. Perfect for beginners to advanced learners.",
    price: 2500,
    category: "Electronics",
    seller_email: "teacher@example.com",
    location: "Dasmariñas, Cavite",
    image_url: null,
  },
  {
    title: "Philippines 2,000 Piso Banknote, 1998, P-187a, UNC, Commemorative",
    description:
      "Uncirculated commemorative 2000 peso banknote from 1998. Perfect condition, great for collectors.",
    price: 2250,
    category: "Entertainment",
    seller_email: "numismatist@example.com",
    location: "Mandaluyong, NCR",
    image_url: null,
  },
  {
    title: "POCO F4 GT / K50 Gaming Phone",
    description:
      "High-performance gaming phone with Snapdragon processor. Excellent for mobile gaming and daily use.",
    price: 9000,
    category: "Electronics",
    seller_email: "techseller@example.com",
    location: "Muntinlupa, NCR",
    image_url: null,
  },
  {
    title: "2 Bedroom House in Paranaque",
    description:
      "Spacious 2-bedroom house in a quiet neighborhood. Perfect for small families. Near schools and shopping centers.",
    price: 3500000,
    category: "Property",
    seller_email: "realestate@example.com",
    location: "Parañaque, NCR",
    image_url: null,
  },
  {
    title: "Brand New Nike Air Jordan Retro",
    description:
      "Authentic Nike Air Jordan Retro sneakers in perfect condition. Size 9. Limited edition colorway.",
    price: 8500,
    category: "Apparel",
    seller_email: "sneakerseller@example.com",
    location: "Quezon City, NCR",
    image_url: null,
  },
  {
    title: "MacBook Pro 14-inch M2",
    description:
      "Latest MacBook Pro with M2 chip. 512GB storage, 16GB RAM. Perfect for professionals and students.",
    price: 85000,
    category: "Electronics",
    seller_email: "appleusedhigh@example.com",
    location: "Makati, NCR",
    image_url: null,
  },
  {
    title: "Honda Civic 2020",
    description:
      "Well-maintained Honda Civic with low mileage. Regular maintenance, clean papers. Great fuel efficiency.",
    price: 950000,
    category: "Vehicles",
    seller_email: "hondadealer@example.com",
    location: "Las Piñas, NCR",
    image_url: null,
  },
  {
    title: "Yamaha R15 V3 Motorcycle",
    description:
      "Sporty Yamaha R15 V3 in excellent condition. Perfect for city riding and weekend trips.",
    price: 125000,
    category: "Vehicles",
    seller_email: "bikeseller@example.com",
    location: "Parañaque, NCR",
    image_url: null,
  },
];

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === "seed") {
      // Insert sample listings
      const { data, error } = await supabase
        .from("listings")
        .insert(sampleListings)
        .select();

      if (error) {
        console.error("Error seeding database:", error);
        return NextResponse.json(
          { error: "Failed to seed database", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Successfully inserted ${data.length} listings`,
        count: data.length,
      });
    }

    if (action === "clear") {
      // Clear all listings
      const { error } = await supabase
        .from("listings")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all records

      if (error) {
        console.error("Error clearing database:", error);
        return NextResponse.json(
          { error: "Failed to clear database", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Database cleared successfully",
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "seed" or "clear"' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
