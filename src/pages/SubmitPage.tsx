import React, { useEffect } from "react";
import MessageForm from "@/components/message/MessageForm";
import PageTransition from "@/components/layout/PageTransition";
import { useToast } from "@/hooks/use-toast";

const SubmitPage: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Check for browser compatibility for recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Browser supports getUserMedia
    } else {
      toast({
        variant: "warning",
        title: "Limited functionality",
        description:
          "Your browser may not support voice recording. Please use a modern browser for all features.",
      });
    }
  }, [toast]);

  return (
    <PageTransition>
      <div className="mx-auto px-4 py-12 max-w-2xl container">
        <MessageForm />
      </div>
    </PageTransition>
  );
};

export default SubmitPage;
