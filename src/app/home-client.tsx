"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesModal } from "@/components/layout/categories-modal";
import { getListings, type Listing } from "@/lib/api";
import { getCategoryByValue } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Format price to Philippine Peso
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate relative time using date-fns
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Update selectedCategory and searchQuery when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "all";
    const searchFromUrl = searchParams.get("search") || "";
    setSelectedCategory(categoryFromUrl);
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const params: { category?: string; search?: string } = {};

        if (selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const data = await getListings(params);
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (searchQuery.trim()) {
      url.searchParams.set("search", searchQuery.trim());
    } else {
      url.searchParams.delete("search");
    }
    router.push(url.pathname + url.search);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    router.push(url.pathname + url.search);
  };

  return (
    <div className="relative">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-sans">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : "Today's picks"}
          </h2>

          {/* Mobile Categories Button */}
          <CategoriesModal>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center space-x-2 h-9 px-3 bg-white border-gray-300 hover:bg-gray-50 rounded-full font-sans"
            >
              <span className="text-sm text-gray-700">Categories</span>
            </Button>
          </CategoriesModal>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search marketplace..."
              className="pl-10 bg-gray-100 border-0 rounded-full h-10 focus:bg-white focus:shadow-sm text-sm font-sans"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 px-2"
              >
                Clear
              </Button>
            )}
          </form>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2 font-sans">
              {loading ? "Searching..." : `Found ${listings.length} items`}
            </p>
          )}
        </div>

        {/* Items Grid - Mobile first approach */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-fr">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm h-full flex flex-col min-h-[320px]"
              >
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="aspect-square bg-gray-200 rounded-t-lg animate-pulse flex-shrink-0"></div>
                  <div className="p-3 space-y-2 flex-grow min-h-[120px] flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : listings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 font-sans">
                {selectedCategory === "all"
                  ? "No listings available yet."
                  : `No listings found in ${
                      getCategoryByValue(selectedCategory)?.label ||
                      selectedCategory
                    }.`}
              </p>
              <p className="text-sm text-gray-400 font-sans mt-2">
                {selectedCategory === "all"
                  ? "Be the first to create a listing!"
                  : "Try selecting a different category or create a new listing."}
              </p>
            </div>
          ) : (
            listings.map((item: Listing) => (
              <Link key={item.id} href={`/item/${item.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm overflow-hidden h-full flex flex-col min-h-[320px]">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-square bg-gray-200 relative overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-sans">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-grow justify-between min-h-[120px]">
                      {/* Top content */}
                      <div className="flex flex-col">
                        <div className="font-semibold text-base sm:text-lg text-gray-900 font-sans mb-2">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-sm text-gray-700 line-clamp-2 leading-tight font-sans mb-3">
                          {item.title}
                        </div>
                      </div>

                      {/* Bottom content */}
                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-sans">
                          <div className="flex items-center min-w-0 flex-1">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <span className="flex-shrink-0 ml-2">
                            {getRelativeTime(item.created_at)}
                          </span>
                        </div>
                        {item.category && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block font-sans">
                            {item.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
