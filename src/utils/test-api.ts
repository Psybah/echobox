import { fetchMessages, markMessageAsRead } from "@/api/messages";
import { sendMessage } from "@/api/media";

/**
 * Test function for API endpoints
 * Can be used in development to verify API functionality
 */
export async function testApi(): Promise<void> {
  console.log("Testing API endpoints...");

  try {
    console.log("Testing fetchMessages()");
    const messages = await fetchMessages();
    console.log(`Successfully fetched ${messages.length} messages`);

    if (messages.length > 0) {
      const firstMessage = messages[0];
      console.log("Testing markMessageAsRead()");
      await markMessageAsRead(firstMessage.id);
      console.log(`Successfully marked message ${firstMessage.id} as read`);
    }

    console.log("API tests completed successfully");
  } catch (error) {
    console.error("API test failed:", error);
  }
}
