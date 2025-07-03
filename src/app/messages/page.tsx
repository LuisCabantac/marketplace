"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Search,
  Clock,
  User,
  ArrowRight,
  Inbox,
} from "lucide-react";
import {
  getMessages,
  getListings,
  type Message,
  type Listing,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface MessageWithListing extends Message {
  listing?: Listing;
}

interface ConversationGroup {
  listing_id: string;
  listing?: Listing;
  messages: Message[];
  lastMessage: Message;
  participants: string[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      // Get all listings first to map listing details
      const listings = await getListings();

      // Get all messages for all listings
      const allMessages: MessageWithListing[] = [];

      for (const listing of listings) {
        const messages = await getMessages({ listing_id: listing.id });
        const messagesWithListing = messages.map((msg) => ({
          ...msg,
          listing: listing,
        }));
        allMessages.push(...messagesWithListing);
      }

      // Group messages by listing and create conversations
      const conversationMap = new Map<string, ConversationGroup>();

      allMessages.forEach((message) => {
        const key = message.listing_id;

        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            listing_id: message.listing_id,
            listing: message.listing,
            messages: [],
            lastMessage: message,
            participants: [],
          });
        }

        const conversation = conversationMap.get(key)!;
        conversation.messages.push(message);

        // Update last message if this one is newer
        if (
          new Date(message.created_at) >
          new Date(conversation.lastMessage.created_at)
        ) {
          conversation.lastMessage = message;
        }

        // Add participants
        if (!conversation.participants.includes(message.buyer_email)) {
          conversation.participants.push(message.buyer_email);
        }
        if (!conversation.participants.includes(message.seller_email)) {
          conversation.participants.push(message.seller_email);
        }
      });

      // Sort conversations by last message time
      const sortedConversations = Array.from(conversationMap.values()).sort(
        (a, b) =>
          new Date(b.lastMessage.created_at).getTime() -
          new Date(a.lastMessage.created_at).getTime()
      );

      setConversations(sortedConversations);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const searchLower = searchTerm.toLowerCase();
    const emailMatch =
      selectedEmail === "" || conversation.participants.includes(selectedEmail);
    const textMatch =
      searchTerm === "" ||
      conversation.listing?.title.toLowerCase().includes(searchLower) ||
      conversation.lastMessage.message.toLowerCase().includes(searchLower) ||
      conversation.participants.some((email) =>
        email.toLowerCase().includes(searchLower)
      );

    return emailMatch && textMatch;
  });

  const allEmails = Array.from(
    new Set(conversations.flatMap((conv) => conv.participants))
  ).sort();

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 font-sans">
              Messages
            </h1>
            <p className="text-gray-600 font-sans mt-1">
              View all conversations from your listings
            </p>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-sans">
            Messages
          </h1>
          <p className="text-gray-600 font-sans mt-1">
            View all conversations from your listings ({conversations.length}{" "}
            conversations)
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search messages, listings, or participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-sans"
              />
            </div>
          </div>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white font-sans text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All participants</option>
            {allEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 font-sans mb-2">
                {conversations.length === 0
                  ? "No messages yet"
                  : "No conversations found"}
              </h3>
              <p className="text-gray-600 font-sans">
                {conversations.length === 0
                  ? "Messages from interested buyers will appear here when they contact you about your listings."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.listing_id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Listing Image */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                      {conversation.listing?.image_url ? (
                        <Image
                          src={conversation.listing.image_url}
                          alt={conversation.listing.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Conversation Details */}
                    <div className="flex-1 min-w-0">
                      {/* Listing Title and Link */}
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          href={`/item/${conversation.listing_id}`}
                          className="font-medium text-gray-900 font-sans hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {conversation.listing?.title || "Unknown Listing"}
                        </Link>
                        <Badge
                          variant="secondary"
                          className="ml-2 flex-shrink-0"
                        >
                          {conversation.messages.length} message
                          {conversation.messages.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 font-sans">
                          {conversation.participants.join(" • ")}
                        </span>
                      </div>

                      {/* Last Message */}
                      <div className="mb-2">
                        <p className="text-sm text-gray-700 font-sans line-clamp-2">
                          <span className="font-medium">
                            {conversation.lastMessage.buyer_email ===
                            conversation.lastMessage.seller_email
                              ? "You"
                              : conversation.lastMessage.buyer_email.split(
                                  "@"
                                )[0]}
                            :
                          </span>{" "}
                          {conversation.lastMessage.message}
                        </p>
                      </div>

                      {/* Time and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-sans">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatTime(conversation.lastMessage.created_at)}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            // For now, just show the listing. In the future, this could open a detailed conversation view
                            window.location.href = `/item/${conversation.listing_id}`;
                          }}
                        >
                          View Listing
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
