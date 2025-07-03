import { useState, useEffect } from "react";
import { getListings, getMessages } from "@/lib/api";

export function useMessageCount() {
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessageCount() {
      try {
        setLoading(true);

        // Get all listings first
        const listings = await getListings({ limit: 100 }); // Limit to avoid too many API calls
        let totalMessages = 0;

        // Batch process listings to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < listings.length; i += batchSize) {
          const batch = listings.slice(i, i + batchSize);

          // Process batch concurrently
          const messageCounts = await Promise.all(
            batch.map(async (listing) => {
              try {
                const messages = await getMessages({ listing_id: listing.id });
                return messages.length;
              } catch (error) {
                console.error(
                  `Error fetching messages for listing ${listing.id}:`,
                  error
                );
                return 0;
              }
            })
          );

          totalMessages += messageCounts.reduce((sum, count) => sum + count, 0);
        }

        setMessageCount(totalMessages);
      } catch (error) {
        console.error("Error fetching message count:", error);
        setMessageCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchMessageCount();

    // Refresh count every 60 seconds (reduced frequency to be more reasonable)
    const interval = setInterval(fetchMessageCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const incrementMessageCount = () => {
    setMessageCount((prev) => prev + 1);
  };

  return { messageCount, loading, incrementMessageCount };
}
