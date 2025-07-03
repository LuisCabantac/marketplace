"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowLeft, Grid3X3, List, Search } from "lucide-react";
import { getListings, type Listing } from "@/lib/api";
import { getCategoryByValue, MARKETPLACE_CATEGORIES } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Format price to Philippine Peso
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">(
    "newest"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const categorySlug = params.slug as string;
  const category = getCategoryByValue(categorySlug);

  // Update search query from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    async function fetchCategoryListings() {
      setLoading(true);
      try {
        const params: { category: string; search?: string } = {
          category: categorySlug,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        const data = await getListings(params);
        setListings(data);
      } catch (error) {
        console.error("Error fetching category listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) {
      fetchCategoryListings();
    }
  }, [categorySlug, searchQuery]);

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

  // Sort listings
  const sortedListings = [...listings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-sans mb-2">
            Category not found
          </h1>
          <p className="text-gray-600 font-sans mb-4">
            The category you&apos;re looking for doesn&apos;t exist.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6">
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <category.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">
                {category.label}
              </h1>
              <p className="text-gray-600 font-sans text-sm">
                {loading ? "Loading..." : `${listings.length} items available`}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={`Search in ${category.label}...`}
              className="pl-10 pr-20 bg-white border border-gray-300 rounded-lg h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-sans"
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
              {loading
                ? "Searching..."
                : `Found ${listings.length} items for "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Filters and View Controls */}
        <div className="mb-6 flex sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "newest" | "price-low" | "price-high"
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-sans bg-white"
            >
              <option value="newest">Newest first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-fr">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-sm h-full flex flex-col min-h-[320px]"
              >
                <div className="aspect-square bg-gray-200 rounded-t-lg animate-pulse flex-shrink-0"></div>
                <div className="p-3 space-y-2 flex-grow min-h-[120px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <category.icon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 font-sans mb-2">
              No items in {category.label}
            </h3>
            <p className="text-gray-500 font-sans mb-6">
              Be the first to list an item in this category!
            </p>
            <Button
              onClick={() => router.push("/create")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Listing
            </Button>
          </div>
        )}

        {/* Items Grid/List */}
        {!loading && listings.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-fr"
                : "space-y-4"
            }
          >
            {sortedListings.map((item) => (
              <Link key={item.id} href={`/item/${item.id}`}>
                <Card
                  className={`cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm ${
                    viewMode === "list"
                      ? "flex"
                      : "h-full flex flex-col min-h-[320px]"
                  }`}
                >
                  <CardContent
                    className={`p-0 ${
                      viewMode === "grid" ? "h-full flex flex-col" : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        {/* Grid View */}
                        <div className="aspect-square bg-gray-200 rounded-t-lg relative overflow-hidden flex-shrink-0">
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
                          <div className="flex items-center justify-between text-xs text-gray-500 font-sans mt-auto">
                            <div className="flex items-center min-w-0 flex-1">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                            <span className="flex-shrink-0 ml-2">
                              {getRelativeTime(item.created_at)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="flex">
                          <div className="w-32 h-32 bg-gray-200 relative overflow-hidden rounded-l-lg flex-shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                <span className="text-gray-600 text-xs font-sans">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-4 space-y-2">
                            <div className="font-semibold text-lg text-gray-900 font-sans">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-gray-700 font-sans font-medium">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-600 line-clamp-2 font-sans">
                                {item.description}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500 font-sans">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>{item.location}</span>
                              </div>
                              <span>{getRelativeTime(item.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Browse Other Categories */}
        {!loading && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 font-sans mb-6">
              Browse other categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {MARKETPLACE_CATEGORIES.filter(
                (cat) => cat.value !== categorySlug
              )
                .slice(0, 6)
                .map((cat) => (
                  <Link key={cat.value} href={`/category/${cat.value}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow text-center p-4">
                      <CardContent className="p-0">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <cat.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 font-sans">
                          {cat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
