"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_CATEGORIES } from "@/lib/categories";
import { useRouter } from "next/navigation";

interface CategoriesModalProps {
  children: React.ReactNode;
}

export function CategoriesModal({ children }: CategoriesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAll = () => {
    setSelectedCategories([]);
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden">
          {/* Modal Content */}
          <div className="w-full max-w-md bg-white rounded-t-2xl shadow-xl animate-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 font-sans">
                Categories
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {selectedCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-sm text-[#1877F2] hover:bg-blue-50 font-sans"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Popular Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide font-sans">
                      Popular
                    </h4>
                    <div className="space-y-1">
                      {MARKETPLACE_CATEGORIES.filter(
                        (cat) => cat.isPopular
                      ).map((category, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => {
                            toggleCategory(category.label);
                            router.push(`/category/${category.value}`);
                          }}
                          className={`w-full justify-between h-12 px-3 rounded-lg font-sans transition-colors ${
                            selectedCategories.includes(category.label)
                              ? "bg-blue-50 text-[#1877F2] hover:bg-blue-100"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <category.icon
                              className={`w-5 h-5 mr-3 ${
                                selectedCategories.includes(category.label)
                                  ? "text-[#1877F2]"
                                  : "text-gray-600"
                              }`}
                            />
                            <span className="font-medium">
                              {category.label}
                            </span>
                          </div>
                          {selectedCategories.includes(category.label) && (
                            <Check className="w-4 h-4 text-[#1877F2]" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* All Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide font-sans">
                      All Categories
                    </h4>
                    <div className="space-y-1">
                      {MARKETPLACE_CATEGORIES.filter(
                        (cat) => !cat.isPopular
                      ).map((category, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => {
                            toggleCategory(category.label);
                            router.push(`/category/${category.value}`);
                          }}
                          className={`w-full justify-between h-12 px-3 rounded-lg font-sans transition-colors ${
                            selectedCategories.includes(category.label)
                              ? "bg-blue-50 text-[#1877F2] hover:bg-blue-100"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <category.icon
                              className={`w-5 h-5 mr-3 ${
                                selectedCategories.includes(category.label)
                                  ? "text-[#1877F2]"
                                  : "text-gray-600"
                              }`}
                            />
                            <span className="font-medium">
                              {category.label}
                            </span>
                          </div>
                          {selectedCategories.includes(category.label) && (
                            <Check className="w-4 h-4 text-[#1877F2]" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
