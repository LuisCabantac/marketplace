// API client functions to replace direct Supabase calls

// Types that match our API endpoints
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

export interface CreateListingData {
  title: string;
  description: string | null;
  price: number;
  category: string;
  seller_email: string;
  image_url: string | null;
  location: string;
}

export interface SendMessageData {
  listing_id: string;
  buyer_email: string;
  seller_email: string;
  message: string;
}

// Listings API functions
export async function getListings(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Listing[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const url = `/api/listings${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    return data.listings || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

export async function getListingsByCategory(
  category: string
): Promise<Listing[]> {
  return getListings({ category });
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const response = await fetch(`/api/listings/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch listing: ${response.statusText}`);
    }

    const data = await response.json();
    return data.listing;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export async function createListing(
  listingData: CreateListingData
): Promise<{ success: boolean; listing?: Listing; error?: string }> {
  try {
    const response = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Failed to create listing: ${response.statusText}`,
      };
    }

    return {
      success: true,
      listing: data.listing,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    return {
      success: false,
      error: "Network error occurred. Please try again.",
    };
  }
}

export async function updateListing(
  id: string,
  listingData: Partial<CreateListingData>
): Promise<Listing | null> {
  try {
    const response = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.statusText}`);
    }

    const data = await response.json();
    return data.listing;
  } catch (error) {
    console.error("Error updating listing:", error);
    return null;
  }
}

export async function deleteListing(
  id: string,
  hard: boolean = false
): Promise<boolean> {
  try {
    const response = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hard }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete listing: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting listing:", error);
    return false;
  }
}

// Messages API functions
export async function getMessages(params: {
  listing_id: string;
  buyer_email?: string;
  seller_email?: string;
}): Promise<Message[]> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("listing_id", params.listing_id);
    if (params.buyer_email) searchParams.set("buyer_email", params.buyer_email);
    if (params.seller_email)
      searchParams.set("seller_email", params.seller_email);

    const url = `/api/messages?${searchParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function sendMessage(
  messageData: SendMessageData
): Promise<Message | null> {
  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

// Upload API functions
export async function uploadImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function deleteImage(filename: string): Promise<boolean> {
  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete image: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

// Seed Database Functions
export async function seedDatabase(): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  try {
    const response = await fetch("/api/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "seed" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.details || data.error || "Failed to seed database",
      };
    }

    return {
      success: true,
      message: data.message,
      count: data.count,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
}

export async function clearDatabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch("/api/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "clear" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.details || data.error || "Failed to clear database",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Error clearing database:", error);
    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
}
