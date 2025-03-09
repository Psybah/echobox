import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: "image" | "document" | "all";
  maxSizeMB: number;
  selectedFile: File | null;
  onClearFile: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  acceptedFileTypes,
  maxSizeMB,
  selectedFile,
  onClearFile,
}) => {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);

  const getAcceptedFileTypes = () => {
    switch (acceptedFileTypes) {
      case "image":
        return { "image/jpeg": [], "image/png": [], "image/gif": [] };
      case "document":
        return { "application/pdf": [] };
      case "all":
        return {
          "image/jpeg": [],
          "image/png": [],
          "image/gif": [],
          "application/pdf": [],
          "audio/mpeg": [],
          "audio/wav": [],
          "audio/ogg": [],
        };
      default:
        return {};
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          variant: "destructive",
          description: `File size exceeds the maximum limit of ${maxSizeMB}MB`,
        });
        return;
      }

      // Validate file type based on API requirements
      if (acceptedFileTypes === "image" && !file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          description: "Only JPG, PNG, or GIF files are allowed for images",
        });
        return;
      }

      if (acceptedFileTypes === "document" && file.type !== "application/pdf") {
        toast({
          variant: "destructive",
          description: "Only PDF files are allowed for documents",
        });
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect, maxSizeMB, acceptedFileTypes, toast]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptedFileTypes(),
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileTypeText = () => {
    switch (acceptedFileTypes) {
      case "image":
        return "JPG, PNG or GIF";
      case "document":
        return "PDF";
      default:
        return "file";
    }
  };

  return (
    <div className="space-y-2">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            isDragActive ? "border-primary bg-primary/5" : "border-muted",
            isDragReject && "border-destructive bg-destructive/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col justify-center items-center gap-2 text-center">
            <Upload className="w-10 h-10 text-muted-foreground" />
            <h3 className="font-medium text-lg">
              Drag & drop or click to upload
            </h3>
            <p className="max-w-xs text-muted-foreground text-sm">
              Upload a {getFileTypeText()} (max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 glass-card">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-primary/10 p-2 rounded-full">
                {acceptedFileTypes === "image" ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="rounded w-10 h-10 object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-primary/20 rounded w-10 h-10">
                    <span className="font-medium text-xs">
                      {selectedFile.name.split(".").pop()?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFile}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
