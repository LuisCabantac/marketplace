import {
  Car,
  Home,
  Shirt,
  ShoppingBag,
  Laptop,
  Heart,
  Gamepad2,
  Music,
  Gift,
  Wrench,
  Briefcase,
  PawPrint,
  Dumbbell,
  Gamepad,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  icon: LucideIcon;
  label: string;
  value: string;
  isPopular?: boolean;
}

export const MARKETPLACE_CATEGORIES: Category[] = [
  { icon: Car, label: "Vehicles", value: "vehicles", isPopular: true },
  {
    icon: Home,
    label: "Property Rentals",
    value: "property-rentals",
    isPopular: true,
  },
  { icon: Shirt, label: "Apparel", value: "apparel", isPopular: true },
  { icon: Laptop, label: "Electronics", value: "electronics", isPopular: true },
  {
    icon: ShoppingBag,
    label: "Classifieds",
    value: "classifieds",
    isPopular: false,
  },
  {
    icon: Heart,
    label: "Entertainment",
    value: "entertainment",
    isPopular: false,
  },
  { icon: Home, label: "Family", value: "family", isPopular: false },
  { icon: Gift, label: "Free Stuff", value: "free-stuff", isPopular: false },
  {
    icon: Gamepad2,
    label: "Garden & Outdoor",
    value: "garden-outdoor",
    isPopular: false,
  },
  { icon: Heart, label: "Hobbies", value: "hobbies", isPopular: false },
  { icon: Home, label: "Home Goods", value: "home-goods", isPopular: false },
  {
    icon: Wrench,
    label: "Home Improvement",
    value: "home-improvement",
    isPopular: false,
  },
  { icon: Home, label: "Home Sales", value: "home-sales", isPopular: false },
  {
    icon: Music,
    label: "Musical Instruments",
    value: "musical-instruments",
    isPopular: false,
  },
  {
    icon: Briefcase,
    label: "Office Supplies",
    value: "office-supplies",
    isPopular: false,
  },
  {
    icon: PawPrint,
    label: "Pet Supplies",
    value: "pet-supplies",
    isPopular: false,
  },
  {
    icon: Dumbbell,
    label: "Sporting Goods",
    value: "sporting-goods",
    isPopular: false,
  },
  {
    icon: Gamepad,
    label: "Toys & Games",
    value: "toys-games",
    isPopular: false,
  },
  {
    icon: ShoppingBag,
    label: "Buy and sell groups",
    value: "buy-sell-groups",
    isPopular: false,
  },
];

export const POPULAR_CATEGORIES = MARKETPLACE_CATEGORIES.filter(
  (cat) => cat.isPopular
);
export const ALL_CATEGORIES = MARKETPLACE_CATEGORIES.filter(
  (cat) => !cat.isPopular
);

// Helper function to get category by value
export function getCategoryByValue(value: string): Category | undefined {
  return MARKETPLACE_CATEGORIES.find((cat) => cat.value === value);
}

// Helper function to get category by label
export function getCategoryByLabel(label: string): Category | undefined {
  return MARKETPLACE_CATEGORIES.find((cat) => cat.label === label);
}
