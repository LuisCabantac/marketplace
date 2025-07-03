"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKETPLACE_CATEGORIES } from "@/lib/categories";
import { createListing } from "@/lib/api";
import { Camera, X, Image as ImageIcon, User, ArrowLeft } from "lucide-react";

export default function CreateItemPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    seller_email: "",
    image_url: "",
    location: "Quezon City",
  });

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePrice = (price: string) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (!validatePrice(formData.price)) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.seller_email) {
      newErrors.seller_email = "Email is required";
    } else if (!validateEmail(formData.seller_email)) {
      newErrors.seller_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File upload handlers
  const handleFiles = useCallback((files: FileList) => {
    const file = Array.from(files)[0]; // Only take the first file
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setFormData((prev) => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [handleFiles]
  );

  const removeImage = () => {
    setUploadedImage("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + "." + parts[1].slice(0, 2);
    }
    return numericValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      const result = await createListing(listingData);

      if (result.success && result.listing) {
        router.push("/");
      } else {
        setErrors({
          submit: result.error || "Failed to create listing. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      setErrors({ submit: "Network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isFormValid =
    formData.title &&
    formData.price &&
    formData.category &&
    formData.seller_email;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Side - Form */}
        <div className="bg-white border-r border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="gap-3">
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
              <h1 className="text-xl font-semibold text-gray-900 font-sans">
                Item for sale
              </h1>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Luis Cabantac
                </p>
                <p className="text-xs text-gray-500">
                  Listing to Marketplace • Public
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photos Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-900">
                    Photo{uploadedImage ? " • 1 / 1" : ""}
                  </Label>
                  <span className="text-xs text-gray-500">
                    You can add 1 photo.
                  </span>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleFiles(e.target.files)
                    }
                    className="hidden"
                  />
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Add photo</h3>
                  <p className="text-sm text-gray-500 mb-4">or drag and drop</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose file
                  </Button>
                </div>

                {uploadedImage && (
                  <div className="mt-3">
                    <div className="relative group inline-block">
                      <img
                        src={uploadedImage}
                        alt="Uploaded image"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage()}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Required</h3>
                <p className="text-sm text-gray-500">
                  Be as descriptive as possible.
                </p>

                {/* Title */}
                <div className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`border-gray-300 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Input
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => {
                      const formatted = formatPrice(e.target.value);
                      handleInputChange("price", formatted);
                    }}
                    className={`border-gray-300 ${
                      errors.price ? "border-red-500" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger
                      className={`border-gray-300 ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARKETPLACE_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                {/* Condition */}
                <Select>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-900">Description</Label>
                <Textarea
                  placeholder="Tell people more about your item..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="border-gray-300 resize-none"
                />
              </div>

              {/* Location & Contact */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium text-gray-900">Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-900">
                    Contact Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.seller_email}
                    onChange={(e) =>
                      handleInputChange("seller_email", e.target.value)
                    }
                    className={`border-gray-300 ${
                      errors.seller_email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.seller_email && (
                    <p className="text-sm text-red-500">
                      {errors.seller_email}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Error Display */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-3"
                  disabled={loading || !isFormValid}
                >
                  {loading ? "Creating..." : "Next"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="bg-gray-100 p-6">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Preview
            </h2>

            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      Luis Cabantac
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Listed a few seconds ago in {formData.location}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Title</h3>
                  <p className="text-sm text-gray-600">
                    {formData.title || "Title"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Details</h3>
                  <p className="text-sm text-gray-600">
                    {formData.description || "Description will appear here."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Seller information
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium">Luis Cabantac</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Preview */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your listing preview
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                As you create your listing, you can preview
                <br />
                how it will appear to others on Marketplace.
              </p>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {formData.image_url || uploadedImage ? (
                    <img
                      src={formData.image_url || uploadedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No image uploaded</p>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  {formData.price && (
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      ₱{parseFloat(formData.price).toLocaleString("en-PH")}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {formData.title || "Item title will appear here"}
                  </p>
                  {formData.location && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.location}
                    </p>
                  )}
                </div>
              </div>

              <Button variant="outline" className="mt-4 w-full">
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
