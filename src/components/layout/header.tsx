"use client";

import {
  Search,
  MessageCircle,
  Bell,
  Grid3X3,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useMessageContext } from "@/contexts/MessageContext";
import Link from "next/link";

export function Header() {
  const { messageCount, loading } = useMessageContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left Section - Logo, Menu Button, and Search */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex lg:hidden p-2 rounded-full hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Facebook Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl font-sans">f</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search Marketplace"
              className="pl-10 bg-gray-100 border-0 rounded-full h-10 focus:bg-white focus:shadow-sm text-sm font-sans"
            />
          </div>
        </div>

        {/* Center Navigation - Hidden on mobile and tablet */}
        <nav className="hidden xl:flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 px-8 text-gray-600 rounded-none font-sans"
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.64.1 3.34-.13 5-1 5.16-1 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-12 px-8 text-gray-600 font-sans rounded-none"
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2c0 .88-.61 1.62-1.43 1.88L21 8v13h-6v-6h-2v6H7V8l2.43-2.12C8.61 5.62 8 4.88 8 4c0-1.11.89-2 2-2s2 .89 2 2c0 .88-.61 1.62-1.43 1.88L12 7.5l1.43-1.62C12.61 5.62 12 4.88 12 4z" />
                </svg>
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-12 px-8 text-[#1877F2] border-b-2 rounded-none border-[#1877F2] font-sans"
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6">
                <ShoppingBag size={24} />
              </div>
            </div>
          </Button>
        </nav>

        {/* Right Section - Icons and Profile */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 p-0 hidden sm:flex"
          >
            <Grid3X3 className="w-5 h-5 text-gray-700" />
          </Button>

          <Link href="/messages">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 p-0 relative"
            >
              <MessageCircle className="w-5 h-5 text-gray-700" />
              {!loading && messageCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-sans">
                  {messageCount > 99 ? '99+' : messageCount}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
          >
            <Bell className="w-5 h-5 text-gray-700" />
          </Button>

          {/* Profile Avatar */}
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 p-0"
          >
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          </Button>
        </div>
      </div>
    </header>
  );
}
