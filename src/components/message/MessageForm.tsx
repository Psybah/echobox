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
  imageCaption: z.string().max(200, 'Caption cannot exceed 200 characters').optional(),
  documentDescription: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
});

type MessageFormValues = z.infer<typeof MessageFormSchema> & {
  file?: File;
  audio?: Blob;
};

type MessageType = 'text' | 'image' | 'voice' | 'document';

const PLACEHOLDER_MESSAGES = [
  "Sholape dey do hookup",
  "Akeem dey beg for money",
  "BabyTV dey gba",
  "Tofunmi don suck my prick",
  "Uncle Kay shey na you get clt?",
  "God go punish FHG",
  "Oloshi full this department",
  "100l guys how far na",
  "Why 400l people dey do like god"
];

const MessageForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MessageType>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [formReset, setFormReset] = useState(false);
  const { toast } = useToast();
  const [currentPlaceholder, setCurrentPlaceholder] = useState(PLACEHOLDER_MESSAGES[0]);

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
      imageCaption: '',
      documentDescription: '',
    },
  });

  const textValue = watch('text');
  const imageCaptionValue = watch('imageCaption');
  const documentDescriptionValue = watch('documentDescription');

  useEffect(() => {
    if (formReset) {
      reset({ 
        text: '',
        imageCaption: '',
        documentDescription: '',
      });
      setSelectedFile(null);
      setAudioBlob(null);
      setFormReset(false);
    }
  }, [formReset, reset]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % PLACEHOLDER_MESSAGES.length;
      setCurrentPlaceholder(PLACEHOLDER_MESSAGES[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
    
    const formData = new FormData();
    
    if (activeTab === 'text' && data.text) {
      formData.append('text', data.text);
      formData.append('type', 'text');
    } else if (activeTab === 'image' && selectedFile) {
      formData.append('file', selectedFile);
      formData.append('type', 'image');
      if (data.imageCaption) {
        formData.append('caption', data.imageCaption);
      }
    } else if (activeTab === 'voice' && audioBlob) {
      formData.append('audio', audioBlob);
      formData.append('type', 'voice');
    } else if (activeTab === 'document' && selectedFile) {
      formData.append('file', selectedFile);
      formData.append('type', 'document');
      if (data.documentDescription) {
        formData.append('description', data.documentDescription);
      }
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
                    placeholder={currentPlaceholder}
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
              <div className="space-y-4">
                <FileUploadArea
                  onFileSelect={onFileSelect}
                  acceptedFileTypes="image"
                  maxSizeMB={5}
                  selectedFile={selectedFile}
                  onClearFile={() => setSelectedFile(null)}
                />
                {selectedFile && (
                  <div className="space-y-2">
                    <div className="input-gradient-border">
                      <Textarea
                        placeholder="Add a caption to your image..."
                        className={cn(
                          "min-h-20 resize-none bg-transparent no-focus-ring",
                          errors.imageCaption && "border-destructive"
                        )}
                        {...register("imageCaption")}
                      />
                    </div>
                    <div className="flex justify-end">
                      <span className={cn(
                        "text-xs",
                        imageCaptionValue?.length > 150 ? "text-amber-400" : "text-muted-foreground",
                        imageCaptionValue?.length > 200 && "text-destructive"
                      )}>
                        {imageCaptionValue?.length || 0}/200
                      </span>
                    </div>
                    {errors.imageCaption && (
                      <p className="text-destructive text-sm">{errors.imageCaption.message}</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="mt-0">
              <div className="space-y-2">
                <VoiceRecorder onRecordingComplete={onAudioRecorded} />
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="mt-0">
              <div className="space-y-4">
                <FileUploadArea
                  onFileSelect={onFileSelect}
                  acceptedFileTypes="document"
                  maxSizeMB={10}
                  selectedFile={selectedFile}
                  onClearFile={() => setSelectedFile(null)}
                />
                {selectedFile && (
                  <div className="space-y-2">
                    <div className="input-gradient-border">
                      <Textarea
                        placeholder="Add a description to your document..."
                        className={cn(
                          "min-h-20 resize-none bg-transparent no-focus-ring",
                          errors.documentDescription && "border-destructive"
                        )}
                        {...register("documentDescription")}
                      />
                    </div>
                    <div className="flex justify-end">
                      <span className={cn(
                        "text-xs",
                        documentDescriptionValue?.length > 150 ? "text-amber-400" : "text-muted-foreground",
                        documentDescriptionValue?.length > 200 && "text-destructive"
                      )}>
                        {documentDescriptionValue?.length || 0}/200
                      </span>
                    </div>
                    {errors.documentDescription && (
                      <p className="text-destructive text-sm">{errors.documentDescription.message}</p>
                    )}
                  </div>
                )}
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
