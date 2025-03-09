import { MessageType } from "@/components/admin/MessageCard";

const BASE_URL = "https://aesthetic-rosalie-kayode01-339252d2.koyeb.app/api";

/**
 * Interface for message submission options
 */
interface SendMessageOptions {
  type: MessageType;
  text?: string;
  file?: File;
  audio?: Blob;
}

/**
 * Sends a message to the API
 */
export async function sendMessage(options: SendMessageOptions): Promise<void> {
  const formData = new FormData();

  // Add the message type
  formData.append("type", mapTypeToApi(options.type));

  // Add content based on message type
  if (options.type === "text" && options.text) {
    formData.append("text", options.text);
  } else if (options.type === "image" && options.file) {
    formData.append("image", options.file);
    if (options.text) formData.append("text", options.text);
  } else if (options.type === "document" && options.file) {
    formData.append("document", options.file);
    if (options.text) formData.append("text", options.text);
  } else if (options.type === "voice" && options.audio) {
    // Create a file from the audio blob
    const audioFile = new File(
      [options.audio],
      `audio_${new Date().getTime()}.mp3`,
      { type: "audio/mp3" }
    );
    formData.append("audio", audioFile);
  } else {
    throw new Error("Invalid message data");
  }

  try {
    const response = await fetch(`${BASE_URL}/add-message`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error sending message: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

/**
 * Maps our message types to API expected types
 */
function mapTypeToApi(type: MessageType): string {
  switch (type) {
    case "voice":
      return "audio";
    default:
      return type;
  }
}

/**
 * Downloads a media file from the server
 */
export async function downloadMedia(
  id: string,
  fileName: string
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/get-media/${id}`);

    if (!response.ok) {
      throw new Error(`Error downloading media: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor to trigger download
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error(`Failed to download media ${id}:`, error);
    throw error;
  }
}

/**
 * Validates a file based on type and size restrictions
 */
export function validateFile(
  file: File,
  type: "image" | "document" | "audio"
): boolean {
  // Check file size (5MB for images, 10MB for documents and audio)
  const maxSize = type === "image" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;

  if (file.size > maxSize) {
    return false;
  }

  // Check file type
  if (
    type === "image" &&
    !["image/jpeg", "image/png", "image/gif"].includes(file.type)
  ) {
    return false;
  } else if (type === "document" && file.type !== "application/pdf") {
    return false;
  } else if (
    type === "audio" &&
    !["audio/mp3", "audio/mpeg", "audio/ogg", "audio/wav"].includes(file.type)
  ) {
    return false;
  }

  return true;
}
