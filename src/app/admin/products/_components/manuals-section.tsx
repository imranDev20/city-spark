"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, FileText, Upload, AlertCircle } from "lucide-react";
import { ProductFormInputType } from "../schema";
import { cn } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
}

export default function ManualsSection() {
  const { register, setValue, watch } = useFormContext<ProductFormInputType>();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const manuals = watch("manuals") || [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only PDF and Word documents are allowed");
      return false;
    }

    if (file.size > maxSize) {
      setUploadError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(validateFile);

    // if (validFiles.length > 0) {
    //   setValue("manuals", [
    //     ...manuals,
    //     ...validFiles.map((file) => ({
    //       name: file.name,
    //       size: file.size,
    //       type: file.type,
    //       lastModified: file.lastModified,
    //     })),
    //   ]);
    // }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...manuals];
    updatedFiles.splice(index, 1);
    setValue("manuals", updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Manuals & Instructions</CardTitle>
        <CardDescription>
          Upload user manuals, technical documents, and installation guides
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-gray-200",
            "hover:border-primary hover:bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </div>
            <p className="text-xs text-gray-500">
              PDF or Word documents (max. 10MB)
            </p>
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* File List */}
        <div className="space-y-2">
          {manuals.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {/* {file.name} */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {/* {formatFileSize(file.size)} */}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
