import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ConditionalSidebar } from "@/components/layout/conditional-sidebar";
import { MessageProvider } from "@/contexts/MessageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facebook Marketplace",
  description: "Buy and sell in your local community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-50`}
      >
        <MessageProvider>
          <Header />
          <div className="flex h-[calc(100vh-56px)] sm:h-[calc(100vh-56px)]">
            <ConditionalSidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 w-full lg:w-auto">
              {children}
            </main>
          </div>
        </MessageProvider>
      </body>
    </html>
  );
}
