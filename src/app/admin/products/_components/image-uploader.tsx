"use-client";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { CirclePlus, ImagePlus, Trash  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function ImageUploader(props: ControllerRenderProps) {
  const [previews, setPreviews] = React.useState<(string | ArrayBuffer)[]>([]);
  const [selectedPreview, setSelectedPreview] = React.useState<string | ArrayBuffer | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const { onChange } = props;

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (previews.length + acceptedFiles.length > 5) {
        setError("You can only upload a maximum of 5 images.");
        return;
      }

      const newPreviews = [...previews];
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result as string | ArrayBuffer);
          setPreviews(newPreviews);
          if (!selectedPreview) {
            setSelectedPreview(reader.result as string | ArrayBuffer);
          }
        };
        reader.readAsDataURL(file);
      });
      onChange(newPreviews);
      setError(null);
    },
    [previews, selectedPreview, onChange]
  );

  const deleteImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    if (selectedPreview === previews[index]) {
      setSelectedPreview(newPreviews.length > 0 ? newPreviews[0] : null);
    }
    onChange(newPreviews);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 5,
    maxSize: 1000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    noClick: true,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-4">
        {selectedPreview && (
          <>
            <img
              src={selectedPreview as string}
              alt="Uploaded image"
              className="max-h-[400px] rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-4 right-4"
              onClick={() => deleteImage(previews.indexOf(selectedPreview))}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      {previews.length < 5 && (
        <div
          {...getRootProps()}
          className={`mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground ${previews.length > 0 ? "hidden" : ""}`}
        >
          <ImagePlus className="size-20" onClick={open} />
          <Input {...getInputProps()} type="file" />
          {isDragActive ? (
            <p>Drop the image!</p>
          ) : (
            <p>Click here or drag an image to upload it</p>
          )}
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview as string}
              alt={`Uploaded image ${index + 1}`}
              className="h-24 w-24 rounded-lg cursor-pointer border-2 border-transparent hover:border-foreground"
              onClick={() => setSelectedPreview(preview)}
            />
          ))}
          {previews.length < 5 && (
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-transparent border-none outline-none"
              onClick={open}
              type="button"
            >              
              <CirclePlus size="md" className="w-5   text-sky-500" />            
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
