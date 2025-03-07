
import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type FileType = 'image' | 'document' | 'any';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: FileType;
  maxSizeMB?: number;
  className?: string;
  selectedFile?: File | null;
  onClearFile?: () => void;
}

const acceptedTypes = {
  image: 'image/jpeg, image/png, image/webp',
  document: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  any: 'image/jpeg, image/png, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  acceptedFileTypes = 'any',
  maxSizeMB = 10,
  className,
  selectedFile = null,
  onClearFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    const acceptedTypesArray = acceptedTypes[acceptedFileTypes].split(', ');
    const isValidType = acceptedTypesArray.includes(file.type);
    const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

    if (!isValidType) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes} files.`);
      return false;
    }

    if (!isValidSize) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    if (onClearFile) {
      onClearFile();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-echo-blue" />;
    }
    return <File className="w-5 h-5 text-echo-purple" />;
  };

  const getFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type.startsWith('image/')) {
      return (
        <div className="relative w-full h-32 overflow-hidden rounded-md">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 p-3 border rounded-md border-border">
        {getFileIcon(selectedFile)}
        <span className="flex-1 truncate text-sm">{selectedFile.name}</span>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            error && "border-destructive/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept={acceptedTypes[acceptedFileTypes]}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-full bg-muted/30 backdrop-blur-sm">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop or{" "}
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="text-primary hover:underline focus:outline-none"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedFileTypes === 'image'
                  ? 'JPEG, PNG, or WEBP (max. 5MB)'
                  : acceptedFileTypes === 'document'
                  ? 'PDF or DOC (max. 10MB)'
                  : 'Images or documents (max. 10MB)'}
              </p>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {getFilePreview()}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs w-full"
            onClick={handleClearFile}
          >
            <X className="w-4 h-4 mr-1" />
            Remove file
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
