import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is required. Set this environment variable in your deployment platform (e.g., Vercel). See https://vercel.com/docs/concepts/projects/environment-variables"
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_KEY is required. Set this environment variable in your deployment platform (e.g., Vercel). See https://vercel.com/docs/concepts/projects/environment-variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on your database schema
export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  seller_email: string;
  image_url: string | null;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  listing_id: string;
  buyer_email: string;
  seller_email: string;
  message: string;
  created_at: string;
}

// Database functions
export async function getListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }

  return data as Listing[];
}

export async function getListingsByCategory(category: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings by category:", error);
    return [];
  }

  return data as Listing[];
}

export async function createListing(
  listing: Omit<Listing, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("listings")
    .insert([listing])
    .select();

  if (error) {
    console.error("Error creating listing:", error);
    return null;
  }

  return data[0] as Listing;
}

export async function getMessages(listingId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data as Message[];
}

export async function sendMessage(message: Omit<Message, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("messages")
    .insert([message])
    .select();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  return data[0] as Message;
}
