"use client";

import {
  MapPin,
  Plus,
  Bookmark,
  Settings,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MARKETPLACE_CATEGORIES } from "@/lib/categories";
import Link from "next/link";

interface SidebarProps {
  className?: string;
}

const quickActions = [
  { icon: ShoppingBag, label: "Browse all", href: "/" },
  { icon: Bookmark, label: "Your listings", href: "/listings" },
  { icon: Heart, label: "Saved", href: "/saved" },
  { icon: MapPin, label: "Recently viewed", href: "/recent" },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const isActiveRoute = (href: string) => {
    if (href === "/" && pathname === "/" && !currentCategory) return true;
    if (href.startsWith("/") && href !== "/") return pathname.startsWith(href);
    return false;
  };

  const isActiveCategory = (categoryValue: string) => {
    return pathname === `/category/${categoryValue}`;
  };

  return (
    <aside
      className={`w-80 bg-white border-r border-gray-200 h-full overflow-y-auto ${className}`}
    >
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 font-sans">
            Marketplace
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        <div className="flex items-center text-sm text-gray-600 font-sans">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Quezon City · 65 km</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            {quickActions.map((action, index) => {
              const isActive = isActiveRoute(action.href);
              return (
                <Link key={index} href={action.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 px-3 rounded-lg font-sans ${
                      isActive
                        ? "bg-blue-50 hover:text-blue-800 text-blue-700 hover:bg-blue-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isActive ? "bg-blue-600" : "bg-gray-100"
                      }`}
                    >
                      <action.icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          <Link href="/create">
            <Button
              variant="ghost"
              className={`w-full justify-start h-12 px-3 rounded-lg font-sans  bg-blue-600 hover:bg-blue-700 text-white hover:text-white`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create new listing</span>
            </Button>
          </Link>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 font-sans">
            Categories
          </h3>
          <div className="space-y-1">
            {MARKETPLACE_CATEGORIES.map((category, index) => {
              const isActive = isActiveCategory(category.value);
              return (
                <Link key={index} href={`/category/${category.value}`}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 px-3 rounded-lg font-sans ${
                      isActive
                        ? "bg-blue-50 hover:text-blue-800 text-blue-700 hover:bg-blue-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isActive ? "bg-blue-600" : "bg-gray-100"
                      }`}
                    >
                      <category.icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{category.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
