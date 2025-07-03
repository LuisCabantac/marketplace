import type { Metadata } from "next";
import { getCategoryByValue } from "@/lib/categories";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryByValue(slug);

  if (!category) {
    return {
      title: "Category Not Found | Facebook Marketplace",
      description: "The category you're looking for doesn't exist.",
    };
  }

  return {
    title: `${category.label} | Facebook Marketplace`,
    description: `Browse ${category.label.toLowerCase()} items for sale in your local community. Buy and sell ${category.label.toLowerCase()} on Facebook Marketplace.`,
    keywords: [
      category.label.toLowerCase(),
      "marketplace",
      "buy",
      "sell",
      "local",
      "community",
      "classifieds",
    ],
    openGraph: {
      title: `${category.label} | Facebook Marketplace`,
      description: `Browse ${category.label.toLowerCase()} items for sale in your local community.`,
      type: "website",
      siteName: "Facebook Marketplace",
    },
    twitter: {
      card: "summary",
      title: `${category.label} | Facebook Marketplace`,
      description: `Browse ${category.label.toLowerCase()} items for sale in your local community.`,
    },
  };
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>;
}
