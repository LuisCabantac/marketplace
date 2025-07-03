"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send } from "lucide-react";
import { sendMessage, type SendMessageData } from "@/lib/api";

interface MessageFormProps {
  listingId: string;
  sellerEmail: string;
  onMessageSent?: () => void;
}

export function MessageForm({
  listingId,
  sellerEmail,
  onMessageSent,
}: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const messageData: SendMessageData = {
        listing_id: listingId,
        buyer_email: buyerEmail.trim(),
        seller_email: sellerEmail,
        message: message.trim(),
      };

      const result = await sendMessage(messageData);

      if (result) {
        setSuccess(true);
        setMessage("");
        setBuyerEmail("");
        onMessageSent?.();

        // Auto close after 2 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } else {
        setSubmitError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 font-sans flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Send Message to Seller
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-700 font-medium font-sans">
              Message sent successfully!
            </p>
            <p className="text-sm text-gray-600 font-sans mt-1">
              The seller will be able to see your message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="buyer-email"
                className="text-sm font-medium text-gray-700 font-sans"
              >
                Your Email
              </Label>
              <Input
                id="buyer-email"
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="mt-1 font-sans"
              />
            </div>

            <div>
              <Label
                htmlFor="message"
                className="text-sm font-medium text-gray-700 font-sans"
              >
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this item. Is it still available?"
                rows={4}
                required
                maxLength={1000}
                className="mt-1 font-sans resize-none"
              />
              <div className="text-xs text-gray-500 font-sans mt-1">
                {message.length}/1000 characters
              </div>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700 font-sans">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !buyerEmail.trim() || !message.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
