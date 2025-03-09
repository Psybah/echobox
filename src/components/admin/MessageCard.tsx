import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  FileText,
  Image,
  Mic,
  MoreVertical,
  Check,
  Trash,
  Download,
  Share,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { markMessageAsRead } from "@/api";

export type MessageType = "text" | "document" | "image" | "voice";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  createdAt: Date;
  isRead: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface MessageCardProps {
  message: Message;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onMarkRead,
  onDelete,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const { toast } = useToast();

  // When drawer is opened and message is unread, mark it as read
  useEffect(() => {
    if (isDrawerOpen && !message.isRead) {
      handleMarkAsRead();
    }
  }, [isDrawerOpen, message.isRead]);

  const handleMarkAsRead = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (message.isRead) return;

    try {
      await markMessageAsRead(message.id);
      onMarkRead(message.id);
      toast({
        description: "Message marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to mark message as read",
      });
    }
  };

  const handleExportToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prepare the content for WhatsApp
    let messageContent = "";

    if (message.type === "text") {
      messageContent = message.content;
    } else {
      messageContent = message.content
        ? `${message.content} (${message.type} attachment)`
        : `${message.type} attachment`;
    }

    // Open WhatsApp with the message content
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      messageContent
    )}`;
    window.open(whatsappUrl, "_blank");

    toast({
      description: "Opened in WhatsApp",
    });
  };

  const handleScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      description: "Screenshot feature coming soon",
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawerOpen(false);
    onDelete(message.id);
    toast({
      description: "Message removed from view",
    });
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!message.fileUrl || !message.fileName) return;

    try {
      setMediaLoading(true);
      // Here we're using the standard browser download approach
      const link = document.createElement("a");
      link.href = message.fileUrl;
      link.download = message.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        description: "Download started",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to download file",
      });
    } finally {
      setMediaLoading(false);
    }
  };

  const getTypeIcon = () => {
    switch (message.type) {
      case "text":
        return <MessageSquare className="w-4 h-4 text-echo-purple" />;
      case "document":
        return <FileText className="w-4 h-4 text-echo-blue" />;
      case "image":
        return <Image className="w-4 h-4 text-green-400" />;
      case "voice":
        return <Mic className="w-4 h-4 text-amber-400" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const messagePreview = () => {
    if (message.type === "text") {
      return message.content.length > 100
        ? `${message.content.substring(0, 100)}...`
        : message.content;
    }

    if (message.content) {
      return message.content;
    }

    return message.fileName || `${message.type} attachment`;
  };

  const getCardClassName = () => {
    return cn(
      "glass relative rounded-lg p-4 transition-all duration-200 hover:bg-white/10 cursor-pointer",
      !message.isRead && "border-l-2 border-l-echo-purple"
    );
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <motion.div
          className={getCardClassName()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-muted p-2 rounded-full">{getTypeIcon()}</div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                </span>
                <p
                  className={cn(
                    "text-sm mt-1",
                    !message.isRead && "font-medium"
                  )}
                >
                  {messagePreview()}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="p-0 w-8 h-8"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!message.isRead && (
                  <DropdownMenuItem onClick={handleMarkAsRead}>
                    <Check className="mr-2 w-4 h-4" />
                    <span>Mark as read</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleExportToWhatsApp}>
                  <Share className="mr-2 w-4 h-4" />
                  <span>Export to WhatsApp</span>
                </DropdownMenuItem>
                {message.type !== "text" && (
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 w-4 h-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 w-4 h-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!message.isRead && (
            <span className="top-2 right-2 absolute bg-echo-purple rounded-full w-2 h-2" />
          )}
        </motion.div>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-3xl">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-muted p-2 rounded-full">{getTypeIcon()}</div>
                <span className="text-muted-foreground text-sm">
                  {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                </span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash className="mr-2 w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="p-6 glass-card">
              {message.type === "text" ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : message.type === "image" ? (
                <div className="space-y-4">
                  {message.content && (
                    <p className="text-center italic">{message.content}</p>
                  )}
                  <div className="flex justify-center">
                    <img
                      src={message.fileUrl}
                      alt={message.content || "Image attachment"}
                      className="rounded-md max-w-full max-h-[60vh] object-contain"
                      onError={() => setMediaError(true)}
                    />
                  </div>
                  {mediaError && (
                    <div className="text-destructive text-center">
                      Failed to load image.{" "}
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open directly
                      </a>
                    </div>
                  )}
                </div>
              ) : message.type === "voice" ? (
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-md audio-player">
                    <audio controls className="w-full">
                      <source src={message.fileUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Audio
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center py-10">
                  <FileText className="mb-4 w-16 h-16 text-muted-foreground" />
                  {message.content && (
                    <p className="mb-4 text-center">{message.content}</p>
                  )}
                  <p className="font-medium text-sm">
                    {message.fileName || "Document attachment"}
                  </p>
                  <div className="flex gap-2 mt-6">
                    <Button size="sm" asChild>
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 w-4 h-4" />
                        Open
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MessageCard;
