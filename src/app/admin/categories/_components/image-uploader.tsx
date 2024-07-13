"use-client";
import React from "react";
import {  ControllerRenderProps } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";

export default function ImageUploader(props:ControllerRenderProps) {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");
  
  const {onChange} = props;

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        onChange(acceptedFiles[0]);
       
        console.log(`acceptedFiles`, acceptedFiles);
      } catch (error) {
        setPreview(null);
     
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  

  return (
        <div
        {...getRootProps()}
        className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
      >
        {preview && (
          <img
            src={preview as string}
            alt="Uploaded image"
            className="max-h-[400px]  rounded-lg"
          />
        )}
        <ImagePlus
          className={`size-20 ${preview ? "hidden" : "block"}`}
        />
        <Input {...getInputProps()} type="file" />
        {isDragActive ? (
          <p>Drop the image!</p>
        ) : (
          <p className={`${preview ? "hidden" : "block"}`}>Click here or drag an image to upload it</p>
        )}
      </div>
  );
};

