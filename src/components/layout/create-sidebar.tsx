"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleCheckBig, Tag, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    icon: CircleCheckBig,
    title: "Choose listing type",
    path: "/create",
  },
  {
    icon: Tag,
    title: "Your listings",
    path: "/create#",
  },
  {
    icon: HelpCircle,
    title: "Seller Help",
    path: "/create#",
  },
];

interface CreateSidebarProps {
  className?: string;
}

export function CreateSidebar({ className }: CreateSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn("w-80 bg-white border-r border-gray-200 h-full", className)}
    >
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-sans">
            Create new listing
          </h1>
        </div>

        <div className="space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link key={index} href={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-12 px-3 rounded-lg font-sans ${
                    isActive
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isActive ? "bg-blue-600" : "bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
