
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, LayoutGrid, List as ListIcon, 
  Calendar, SlidersHorizontal, MessageSquare, Image, 
  FileText, Mic, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import MessageCard, { Message, MessageType } from './MessageCard';
import { cn } from '@/lib/utils';

// Mock data generator
const generateMockMessages = (count: number): Message[] => {
  const types: MessageType[] = ['text', 'image', 'voice', 'document'];
  const messages: Message[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const daysAgo = Math.floor(Math.random() * 14); // 0-14 days ago
    
    const message: Message = {
      id: `msg-${i}`,
      type,
      content: type === 'text' 
        ? `This is a sample message content. It's a ${type} message that was sent anonymously. ${Math.random() > 0.5 ? 'It contains some additional text to make it longer and test the preview functionality.' : ''}`
        : '',
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      isRead: Math.random() > 0.3, // 30% unread
    };
    
    if (type !== 'text') {
      message.fileName = `${type}_file_${i}.${type === 'image' ? 'jpg' : type === 'document' ? 'pdf' : 'mp3'}`;
      message.fileSize = Math.floor(Math.random() * (type === 'image' ? 5 : 10) * 1024 * 1024); // 0-5MB for images, 0-10MB for others
      message.fileUrl = `/placeholder.svg`; // Placeholder URL
    }
    
    messages.push(message);
  }
  
  return messages;
};

// Sort options
type SortOption = 'newest' | 'oldest' | 'unread';

const MessageDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<MessageType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = generateMockMessages(50);
      setMessages(mockData);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...messages];
    
    // Apply type filter
    if (selectedTypeFilter !== 'all') {
      filtered = filtered.filter(msg => msg.type === selectedTypeFilter);
    }
    
    // Apply unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter(msg => !msg.isRead);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (msg.fileName && msg.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply sorting
    switch(sortOption) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'unread':
        filtered.sort((a, b) => {
          if (a.isRead === b.isRead) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          return a.isRead ? 1 : -1;
        });
        break;
    }
    
    setFilteredMessages(filtered);
  }, [messages, selectedTypeFilter, showUnreadOnly, searchQuery, sortOption]);
  
  // Get paginated results
  const paginatedMessages = filteredMessages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  
  const handleMarkAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };
  
  const handleTypeSelect = (type: MessageType | 'all') => {
    setSelectedTypeFilter(type);
    setPage(1);
  };

  const getTypeIcon = (type: MessageType | 'all') => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'voice':
        return <Mic className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeCount = (type: MessageType | 'all') => {
    if (type === 'all') return messages.length;
    return messages.filter(msg => msg.type === type).length;
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  // Skeletons for loading state
  const MessageSkeleton = () => (
    <div className="glass animate-pulse rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gradient">Message Dashboard</h1>
        
        <div className="flex items-center gap-2 self-end">
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-9 w-9"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-9 w-9"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Messages</h4>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Message Type</h5>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedTypeFilter === 'all' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeSelect('all')}
                      className="h-8"
                    >
                      All ({getTypeCount('all')})
                    </Button>
                    <Button
                      variant={selectedTypeFilter === 'text' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeSelect('text')}
                      className="h-8"
                    >
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Text ({getTypeCount('text')})
                    </Button>
                    <Button
                      variant={selectedTypeFilter === 'image' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeSelect('image')}
                      className="h-8"
                    >
                      <Image className="mr-1 h-3 w-3" />
                      Image ({getTypeCount('image')})
                    </Button>
                    <Button
                      variant={selectedTypeFilter === 'voice' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeSelect('voice')}
                      className="h-8"
                    >
                      <Mic className="mr-1 h-3 w-3" />
                      Voice ({getTypeCount('voice')})
                    </Button>
                    <Button
                      variant={selectedTypeFilter === 'document' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeSelect('document')}
                      className="h-8"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Document ({getTypeCount('document')})
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {[...Array(6)].map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      ) : paginatedMessages.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <h3 className="text-lg font-medium">No messages found</h3>
          <p className="text-muted-foreground mt-2">
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
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
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
            <div className="flex items-center justify-center space-x-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageDashboard;
