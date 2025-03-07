
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Mic, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { VoiceRecorder } from '@/components/ui/voice-recorder';
import FileUploadArea from '@/components/file-upload/FileUploadArea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const MessageFormSchema = z.object({
  text: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
});

type MessageFormValues = z.infer<typeof MessageFormSchema> & {
  file?: File;
  audio?: Blob;
};

type MessageType = 'text' | 'image' | 'voice' | 'document';

const MessageForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MessageType>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [formReset, setFormReset] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MessageFormValues>({
    resolver: zodResolver(MessageFormSchema),
    defaultValues: {
      text: '',
    },
  });

  const textValue = watch('text');

  useEffect(() => {
    if (formReset) {
      reset({ text: '' });
      setSelectedFile(null);
      setAudioBlob(null);
      setFormReset(false);
    }
  }, [formReset, reset]);

  const onFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setActiveTab('image');
    } else {
      setActiveTab('document');
    }
  };

  const onAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const onSubmit: SubmitHandler<MessageFormValues> = async (data) => {
    setIsSubmitting(true);
    
    // Create form data for submission
    const formData = new FormData();
    
    if (activeTab === 'text' && data.text) {
      formData.append('text', data.text);
      formData.append('type', 'text');
    } else if (activeTab === 'image' && selectedFile) {
      formData.append('file', selectedFile);
      formData.append('type', 'image');
    } else if (activeTab === 'voice' && audioBlob) {
      formData.append('audio', audioBlob);
      formData.append('type', 'voice');
    } else if (activeTab === 'document' && selectedFile) {
      formData.append('file', selectedFile);
      formData.append('type', 'document');
    } else {
      toast({
        title: "No content to send",
        description: "Please provide content before submitting",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Mock API call - replace with actual API endpoint when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent successfully",
        description: "Your anonymous message has been delivered",
      });
      
      setFormReset(true);
      setActiveTab('text');
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };
  
  const charCount = textValue?.length || 0;
  
  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      className="w-full glass-card p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gradient">Send Anonymous Message</h2>
        <p className="text-sm text-muted-foreground">
          Share your thoughts anonymously. No sign-up required. Your identity remains private.
        </p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as MessageType)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="text" className="flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center justify-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Image</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center justify-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="document" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Document</span>
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="text" className="mt-0">
              <div className="space-y-4">
                <div className="input-gradient-border">
                  <Textarea
                    placeholder="Type your anonymous message here..."
                    className={cn(
                      "min-h-32 resize-none bg-transparent no-focus-ring",
                      errors.text && "border-destructive"
                    )}
                    {...register("text")}
                  />
                </div>
                <div className="flex justify-end">
                  <span className={cn(
                    "text-xs",
                    charCount > 900 ? "text-amber-400" : "text-muted-foreground",
                    charCount > 1000 && "text-destructive"
                  )}>
                    {charCount}/1000
                  </span>
                </div>
                {errors.text && (
                  <p className="text-destructive text-sm">{errors.text.message}</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="mt-0">
              <div className="space-y-2">
                <FileUploadArea
                  onFileSelect={onFileSelect}
                  acceptedFileTypes="image"
                  maxSizeMB={5}
                  selectedFile={selectedFile}
                  onClearFile={() => setSelectedFile(null)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="mt-0">
              <div className="space-y-2">
                <VoiceRecorder onRecordingComplete={onAudioRecorded} />
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="mt-0">
              <div className="space-y-2">
                <FileUploadArea
                  onFileSelect={onFileSelect}
                  acceptedFileTypes="document"
                  maxSizeMB={10}
                  selectedFile={selectedFile}
                  onClearFile={() => setSelectedFile(null)}
                />
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
      
      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto relative overflow-hidden group"
        >
          <span className={cn(
            "inline-flex items-center gap-2 transition-transform duration-200",
            isSubmitting && "translate-y-10"
          )}>
            <Send className="h-4 w-4" />
            Send Anonymously
          </span>
          {isSubmitting && (
            <span className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            </span>
          )}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-200" />
        </Button>
      </div>
    </motion.form>
  );
};

export default MessageForm;
