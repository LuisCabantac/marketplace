"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Heart, Share, User, Clock } from "lucide-react";
import { getListingById, type Listing } from "@/lib/api";
import { getCategoryByValue } from "@/lib/categories";
import { MessageForm } from "@/components/ui/message-form";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        if (typeof params.id === "string") {
          const listing = await getListingById(params.id);
          setListing(listing);
        } else {
          setListing(null);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-sans mb-2">
            Item not found
          </h1>
          <p className="text-gray-600 font-sans mb-4">
            The listing you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go back to marketplace
          </Button>
        </div>
      </div>
    );
  }

  const category = getCategoryByValue(listing.category);

  async function handleBuyNow() {
    if (!listing) return;
    setBuying(true);
    try {
      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: listing.price,
          title: listing.title,
          listingId: listing.id,
          sellerEmail: listing.seller_email,
          buyerEmail: "buyer@gmail.com",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Error starting checkout");
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 font-sans">
            Back to marketplace
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
              {listing.image_url ? (
                <Image
                  src={listing.image_url}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-lg font-sans">
                    No image available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price and Title */}
            <div>
              <div className="text-3xl font-bold text-gray-900 font-sans mb-2">
                {formatPrice(listing.price)}
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 font-sans mb-4">
                {listing.title}
              </h1>

              {/* Category Badge */}
              {category && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 w-fit"
                >
                  <category.icon className="w-3 h-3" />
                  {category.label}
                </Badge>
              )}
            </div>

            {/* Location and Time */}
            <div className="flex items-center justify-between text-sm text-gray-600 font-sans">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Listed {getRelativeTime(listing.created_at)}</span>
              </div>
            </div>
            <Button
              onClick={handleBuyNow}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={buying}
            >
              {buying ? "Redirecting..." : "Buy Now"}
            </Button>

            {/* Action Buttons */}
            <div className="grid gap-4">
              <MessageForm
                listingId={listing.id}
                sellerEmail={listing.seller_email}
              />
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSaved(!saved)}
                  className={`px-4 ${
                    saved ? "text-red-600 border-red-600" : ""
                  }`}
                >
                  <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 font-sans mb-3">
                  Description
                </h3>
                <p className="text-gray-700 font-sans leading-relaxed">
                  {listing.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 font-sans mb-3">
                  Seller Information
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 font-sans">
                      {listing.seller_email.split("@")[0]}
                    </div>
                    <div className="text-sm text-gray-600 font-sans">
                      Contact: {listing.seller_email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 font-sans mb-3">
                  Safety Tips
                </h3>
                <ul className="text-sm text-gray-700 font-sans space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Inspect the item before buying</li>
                  <li>• Don&apos;t send money in advance</li>
                  <li>• Trust your instincts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Items Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 font-sans mb-6">
            More from this category
          </h2>
          <div className="text-gray-500 font-sans text-center py-8">
            Related items would be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}
