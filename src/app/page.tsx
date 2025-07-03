import { Suspense } from "react";
import HomePage from "./home-client";

// Loading component for Suspense boundary
function HomePageLoading() {
  return (
    <div className="relative">
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-9 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-8 bg-gray-200 rounded animate-pulse w-20"
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="aspect-square bg-gray-200 rounded-t-lg animate-pulse"></div>
              <div className="p-3 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePage />
    </Suspense>
  );
}
