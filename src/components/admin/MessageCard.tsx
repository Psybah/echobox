
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, FileText, Image, Mic, 
  MoreVertical, Check, Trash, Download, Share
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export type MessageType = 'text' | 'document' | 'image' | 'voice';

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

const MessageCard: React.FC<MessageCardProps> = ({ message, onMarkRead, onDelete }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkRead(message.id);
    toast({
      description: "Message marked as read",
    });
  };

  const handleExportToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      description: "Exported to WhatsApp",
    });
  };

  const handleScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      description: "Screenshot captured",
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(message.id);
    toast({
      description: "Message deleted",
    });
  };

  const getTypeIcon = () => {
    switch (message.type) {
      case 'text':
        return <MessageSquare className="h-4 w-4 text-echo-purple" />;
      case 'document':
        return <FileText className="h-4 w-4 text-echo-blue" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-400" />;
      case 'voice':
        return <Mic className="h-4 w-4 text-amber-400" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const messagePreview = () => {
    if (message.type === 'text') {
      return message.content.length > 100 
        ? `${message.content.substring(0, 100)}...` 
        : message.content;
    }
    return message.fileName || 'File attachment';
  };

  const getCardClassName = () => {
    return cn(
      "glass relative rounded-lg p-4 transition-all duration-200 hover:bg-white/10 cursor-pointer",
      !message.isRead && "border-l-2 border-l-echo-purple",
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
              <div className="p-2 bg-muted rounded-full">{getTypeIcon()}</div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                </span>
                <p className={cn(
                  "text-sm mt-1",
                  !message.isRead && "font-medium"
                )}>
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
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!message.isRead && (
                  <DropdownMenuItem onClick={handleMarkAsRead}>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Mark as read</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleExportToWhatsApp}>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Export to WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleScreenshot}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Capture screenshot</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!message.isRead && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-echo-purple" />
          )}
        </motion.div>
      </DrawerTrigger>

      <DrawerContent className="max-w-3xl mx-auto">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-full">{getTypeIcon()}</div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex gap-2">
                {!message.isRead && (
                  <Button size="sm" variant="outline" onClick={handleMarkAsRead}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as read
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              {message.type === 'text' ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : message.type === 'image' ? (
                <img 
                  src={message.fileUrl} 
                  alt="Message attachment" 
                  className="max-w-full rounded-md"
                />
              ) : message.type === 'voice' ? (
                <div className="audio-player">
                  <audio controls className="w-full">
                    <source src={message.fileUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">{message.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {(message.fileSize && (message.fileSize / 1024 / 1024).toFixed(2)) || '?'} MB
                  </p>
                  <Button className="mt-4" size="sm" asChild>
                    <a href={message.fileUrl} download={message.fileName} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
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
