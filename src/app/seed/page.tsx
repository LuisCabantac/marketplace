"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  seedDatabase as apiSeedDatabase,
  clearDatabase as apiClearDatabase,
} from "@/lib/api";

// Force dynamic rendering to avoid build errors with client components
export const dynamic = "force-dynamic";

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const seedDatabase = async () => {
    setIsSeeding(true);
    setMessage("");

    try {
      const result = await apiSeedDatabase();

      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const clearDatabase = async () => {
    setIsSeeding(true);
    setMessage("");

    try {
      const result = await apiClearDatabase();

      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-sans">Database Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 font-sans">
            Use these buttons to populate your database with sample listings for
            testing.
          </p>

          <div className="flex space-x-4">
            <Button
              onClick={seedDatabase}
              disabled={isSeeding}
              className="bg-[#1877F2] hover:bg-[#166FE5] font-sans"
            >
              {isSeeding ? "Adding Listings..." : "Seed Database"}
            </Button>

            <Button
              onClick={clearDatabase}
              disabled={isSeeding}
              variant="destructive"
              className="font-sans"
            >
              {isSeeding ? "Clearing..." : "Clear Database"}
            </Button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg font-sans ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="text-sm text-gray-500 font-sans">
            <p>
              <strong>Sample data includes:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Gaming collectibles</li>
              <li>Vehicles (cars and motorcycles)</li>
              <li>Electronics and gadgets</li>
              <li>Real estate properties</li>
              <li>Apparel and accessories</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
