import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  RefreshCw,
  MessageSquare,
  Image,
  FileText,
  Mic,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import MessageCard, { Message, MessageType } from "./MessageCard";
import { cn } from "@/lib/utils";
import { fetchMessages, markMessageAsRead } from "@/api";
import { useToast } from "@/hooks/use-toast";

// Sort options
type SortOption = "newest" | "oldest" | "unread";

const MessageDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<
    MessageType | "all"
  >("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const ITEMS_PER_PAGE = 10;

  // Load real data from API
  const loadData = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const data = await fetchMessages();
        setMessages(data);

        if (showToast) {
          toast({
            description: `${data.length} messages loaded successfully`,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load messages",
          description: "Please try again later",
        });
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadData();

    // Set up polling for new messages every 30 seconds
    const intervalId = setInterval(() => {
      loadData(false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...messages];

    // Apply type filter
    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter((msg) => msg.type === selectedTypeFilter);
    }

    // Apply unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter((msg) => !msg.isRead);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (msg) =>
          // Handle null content gracefully
          (msg.content &&
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (msg.fileName &&
            msg.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "unread":
        filtered.sort((a, b) => {
          if (a.isRead === b.isRead) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          return a.isRead ? 1 : -1;
        });
        break;
    }

    setFilteredMessages(filtered);

    // Reset to first page when filters change
    if (
      filtered.length > 0 &&
      page > Math.ceil(filtered.length / ITEMS_PER_PAGE)
    ) {
      setPage(1);
    }
  }, [messages, selectedTypeFilter, showUnreadOnly, searchQuery, sortOption]);

  // Get paginated results
  const paginatedMessages = filteredMessages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMessages.length / ITEMS_PER_PAGE)
  );

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
      );
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to mark message as read",
      });
    }
  };

  const handleDelete = (id: string) => {
    // Currently, API doesn't support message deletion
    // This will only remove from the local state
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    toast({
      description: "Message removed from view",
    });
  };

  const handleTypeSelect = (type: MessageType | "all") => {
    setSelectedTypeFilter(type);
    setPage(1);
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const getTypeIcon = (type: MessageType | "all") => {
    switch (type) {
      case "text":
        return <MessageSquare className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "voice":
        return <Mic className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeCount = (type: MessageType | "all") => {
    if (type === "all") return messages.length;
    return messages.filter((msg) => msg.type === type).length;
  };

  const getUnreadCount = () => {
    return messages.filter((msg) => !msg.isRead).length;
  };

  // Skeletons for loading state
  const MessageSkeleton = () => (
    <div className="p-4 rounded-lg animate-pulse glass">
      <div className="flex items-start gap-3">
        <div className="bg-muted rounded-full w-10 h-10" />
        <div className="flex-1 space-y-2">
          <div className="bg-muted rounded w-20 h-4" />
          <div className="bg-muted rounded w-full h-4" />
          <div className="bg-muted rounded w-2/3 h-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-16 space-y-6 mx-auto p-4 w-full max-w-6xl">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-gradient text-2xl">
            Message Dashboard
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 w-8 h-8"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw
              className={cn(
                "w-4 h-4",
                (isRefreshing || isLoading) && "animate-spin"
              )}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>

        <div className="flex items-center self-end gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="w-9 h-9"
          >
            <ListIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="w-9 h-9"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-4">
        <div className="relative flex-1">
          <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Messages</h4>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Message Type</h5>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={
                        selectedTypeFilter === "all" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeSelect("all")}
                      className="h-8"
                    >
                      All ({getTypeCount("all")})
                    </Button>
                    <Button
                      variant={
                        selectedTypeFilter === "text" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeSelect("text")}
                      className="h-8"
                    >
                      <MessageSquare className="mr-1 w-3 h-3" />
                      Text ({getTypeCount("text")})
                    </Button>
                    <Button
                      variant={
                        selectedTypeFilter === "image" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeSelect("image")}
                      className="h-8"
                    >
                      <Image className="mr-1 w-3 h-3" />
                      Image ({getTypeCount("image")})
                    </Button>
                    <Button
                      variant={
                        selectedTypeFilter === "voice" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeSelect("voice")}
                      className="h-8"
                    >
                      <Mic className="mr-1 w-3 h-3" />
                      Voice ({getTypeCount("voice")})
                    </Button>
                    <Button
                      variant={
                        selectedTypeFilter === "document"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleTypeSelect("document")}
                      className="h-8"
                    >
                      <FileText className="mr-1 w-3 h-3" />
                      Document ({getTypeCount("document")})
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unread"
                    checked={showUnreadOnly}
                    onCheckedChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  />
                  <label
                    htmlFor="unread"
                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                  >
                    Show unread only ({getUnreadCount()})
                  </label>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="unread">Unread first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {[...Array(6)].map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      ) : paginatedMessages.length === 0 ? (
        <div className="p-10 text-center glass-card">
          <h3 className="font-medium text-lg">No messages found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${selectedTypeFilter}-${showUnreadOnly}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "grid gap-4",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {paginatedMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageDashboard;
