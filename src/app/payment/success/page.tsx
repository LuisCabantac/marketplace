"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">
        Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6 font-sans text-center max-w-md">
        Thank you for your purchase. Your payment was processed successfully.
        You will receive a confirmation email shortly.
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Back to Marketplace
      </Button>
    </div>
  );
}
