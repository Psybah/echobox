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
      type: mapMessageType(msg.type),
      content: msg.text || "",
      createdAt: new Date(msg.created_at),
      isRead: msg.is_read === 1,
      ...(msg.type !== "text" && {
        fileName:
          msg.file_name || `${msg.type}_file.${getFileExtension(msg.type)}`,
        fileSize: msg.file_size || 0,
        fileUrl: msg.id ? `${BASE_URL}/get-media/${msg.id}` : "",
      }),
    }));
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
}

/**
 * Marks a message as read
 */
export async function markMessageAsRead(id: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/read-message/${id}`);

    if (!response.ok) {
      throw new Error(`Error marking message as read: ${response.status}`);
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
