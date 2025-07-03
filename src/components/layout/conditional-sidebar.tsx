"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { CreateSidebar } from "@/components/layout/create-sidebar";

export function ConditionalSidebar() {
  const pathname = usePathname();

  // Show create sidebar only on /create route (not nested routes)
  if (pathname === "/create") {
    return (
      <Suspense fallback={<div className="hidden lg:block w-80" />}>
        <CreateSidebar className="hidden lg:block" />
      </Suspense>
    );
  }

  // Show regular sidebar on all other routes except create nested routes
  if (!pathname.startsWith("/create/")) {
    return (
      <Suspense fallback={<div className="hidden lg:block w-80" />}>
        <Sidebar className="hidden lg:block" />
      </Suspense>
    );
  }

  // No sidebar on create nested routes like /create/item
  return null;
}
