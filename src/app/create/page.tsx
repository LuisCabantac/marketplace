"use client";

import { useRouter } from "next/navigation";
import { Package, Home, Car } from "lucide-react";

const listingTypes = [
  {
    icon: Package,
    title: "Item for sale",
    description: "Create a single listing for one or more items to sell.",
    href: "/create/item",
    bgColor: "bg-pink-100",
    iconBg: "bg-pink-500",
  },
  {
    icon: Car,
    title: "Vehicle for sale",
    description: "Sell a car, truck or other type of vehicle.",
    href: "/create/vehicle",
    bgColor: "bg-teal-100",
    iconBg: "bg-teal-500",
  },
  {
    icon: Home,
    title: "Home for sale or rent",
    description: "List a house or apartment for sale or rent.",
    href: "/create/property",
    bgColor: "bg-orange-100",
    iconBg: "bg-orange-500",
  },
];

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-sans mb-2">
            Choose listing type
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listingTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group"
              onClick={() => router.push(type.href)}
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-2xl ${type.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${type.iconBg} flex items-center justify-center`}
                  >
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 font-sans mb-2">
                  {type.title}
                </h3>

                <p className="text-sm text-gray-600 font-sans leading-relaxed">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
