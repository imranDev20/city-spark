"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductFormInputType } from "../schema";
import {
  MultiFileDropzone,
  type FileState,
} from "@/components/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";

export default function ManualsSection() {
  const form = useFormContext<ProductFormInputType>();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const manuals = form.watch("manuals") || [];

  // Initialize fileStates from existing manuals
  useEffect(() => {
    if (fileStates.length === 0 && manuals.length > 0) {
      const states = manuals.map((url) => ({
        file: new File([], url.split("/").pop() || ""),
        key: Math.random().toString(36).slice(2),
        progress: "COMPLETE" as const,
        url: url,
      }));
      setFileStates(states);
    }
  }, [manuals, fileStates.length]);

  function updateFileProgress(
    key: string,
    progress: FileState["progress"],
    url?: string
  ) {
    setFileStates((currentStates) => {
      const newFileStates = structuredClone(currentStates);
      const fileState = newFileStates.find((state) => state.key === key);
      if (fileState) {
        fileState.progress = progress;
        if (url) fileState.url = url;
      }
      return newFileStates;
    });

    // If the file is complete and has a URL, update the form's manuals array
    if (progress === "COMPLETE" && url) {
      const updatedManuals = [...manuals, url];
      form.setValue("manuals", updatedManuals, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  const handleFilesAdded = async (addedFiles: FileState[]) => {
    // Keep existing files and add new ones
    setFileStates((currentStates) => [...currentStates, ...addedFiles]);

    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const progressCallback = async (progress: number) => {
            updateFileProgress(addedFileState.key, progress);
          };

          const res = await edgestore.publicFiles.upload({
            file: addedFileState.file,
            input: {
              type: "manual",
              category: "product",
            },
            options: {
              temporary: true,
            },
            onProgressChange: progressCallback,
          });

          // Add a small delay before marking as complete
          await new Promise((resolve) => setTimeout(resolve, 1000));
          updateFileProgress(addedFileState.key, "COMPLETE", res.url);
        } catch (err) {
          console.error("Upload error:", err);
          updateFileProgress(addedFileState.key, "ERROR");

          // Remove failed upload from fileStates
          setFileStates((current) =>
            current.filter((state) => state.key !== addedFileState.key)
          );
        }
      })
    );
  };

  const handleRemoveFile = (keyToRemove: string) => {
    const fileState = fileStates.find((state) => state.key === keyToRemove);

    // Remove from fileStates
    setFileStates((current) =>
      current.filter((state) => state.key !== keyToRemove)
    );

    // Remove from manuals if URL exists
    if (fileState?.url) {
      const updatedManuals = manuals.filter((url) => url !== fileState.url);
      form.setValue("manuals", updatedManuals, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
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
        <MultiFileDropzone
          value={fileStates}
          dropzoneOptions={{
            maxSize: 10 * 1024 * 1024,
            accept: {
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            },
          }}
          onChange={(files) => {
            setFileStates(files);
            // Update manuals array to match remaining files
            const updatedManuals = files
              .filter((f) => f.progress === "COMPLETE" && f.url)
              .map((f) => f.url!);
            form.setValue("manuals", updatedManuals, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          onFilesAdded={handleFilesAdded}
          onFileRemove={handleRemoveFile}
        />
      </CardContent>
    </Card>
  );
}
