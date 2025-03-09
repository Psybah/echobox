import { Message, MessageType } from "@/components/admin/MessageCard";

const BASE_URL = "https://aesthetic-rosalie-kayode01-339252d2.koyeb.app/api";

/**
 * Fetches all messages from the API
 */
export async function fetchMessages(): Promise<Message[]> {
  try {
    const response = await fetch(`${BASE_URL}/get-messages`);

    if (!response.ok) {
      throw new Error(`Error fetching messages: ${response.status}`);
    }

    const data = await response.json();

    // Transform the API response to match our Message interface
    return data.map((msg: any) => ({
      id: msg.id.toString(),
      type: mapMessageType(msg.messageType), // Using messageType from the API
      content: msg.text || "",
      createdAt: new Date(msg.timestamp), // Using timestamp from the API
      isRead: msg.messageStatus !== "unread", // Using messageStatus from the API
      ...(msg.messageType !== "text" && {
        fileName: getFileName(msg.messageType, msg.id, msg.text),
        fileSize: 0, // We don't have this info from the API
        fileUrl: `${BASE_URL}/get-media/${msg.id}`, // Construct media URL
      }),
    }));
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
}

/**
 * Generate a descriptive filename based on message type and content
 */
function getFileName(
  messageType: string,
  id: number,
  text: string | null
): string {
  const extension = getFileExtension(messageType);
  const prefix = text ? sanitizeText(text) : messageType;
  return `${prefix}_${id}.${extension}`;
}

/**
 * Create a safe filename from text content
 */
function sanitizeText(text: string): string {
  // Take first 20 chars and replace non-alphanumeric chars with underscores
  return text
    .slice(0, 20)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_"); // Replace multiple underscores with single
}

/**
 * Marks a message as read
 */
export async function markMessageAsRead(id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/read-message/${id}`);

    if (!response.ok) {
      // ! temporarily disable(feature not implemented)
      // throw new Error(`Error marking message as read: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to mark message ${id} as read:`, error);
    throw error;
  }
}

/**
 * Helper function to map API message types to our MessageType
 */
function mapMessageType(apiType: string): MessageType {
  switch (apiType) {
    case "text":
      return "text";
    case "image":
      return "image";
    case "document":
      return "document";
    case "audio":
      return "voice";
    default:
      return "text";
  }
}

/**
 * Helper function to get file extension based on type
 */
function getFileExtension(type: string): string {
  switch (type) {
    case "image":
      return "jpg";
    case "document":
      return "pdf";
    case "audio":
      return "mp3";
    default:
      return "";
  }
}
