"use-client";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FileRejection, useDropzone } from "react-dropzone";
import { ImagePlus, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function ProductImageUploader(props: ControllerRenderProps) {
  const [previews, setPreviews] = React.useState<(string | ArrayBuffer)[]>([]);
  const [selectedPreview, setSelectedPreview] = React.useState<
    string | ArrayBuffer | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);

  const { onChange } = props;

  const onDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log(`fileRejection`, fileRejections);
      if (previews.length + acceptedFiles.length > 5) {
        setError("You can only upload a maximum of 5 images.");
        return;
      }

      if (fileRejections.length > 0) {
        let errorMessage = fileRejections[0]["errors"][0]["message"];
        setError(errorMessage);
      }
      if (fileRejections.length == 0) {
        setError(null);
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
      // setError(null);
    },
    [previews, selectedPreview, onChange]
  );
  console.log(`error`, error);

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
  const dragDropError = (errorMessage: string) => {
    setError(errorMessage);
    return;
  };
  const handleClickOpen = () => {
    if (previews.length > 5) {
      setError("You can only upload a maximum of 5 images.");
      return;
    }
    open();
  };

  return (
    <>
      <div className="relative flex items-center justify-center mb-4">
        {selectedPreview && (
          <div className="border rounded-lg overflow-hidden w-full h-full min-h-56 flex items-end flex-col">
            <div className="relative w-full h-[250px]">
              <Image
                src={selectedPreview as string}
                alt="Uploaded image"
                className="rounded-lg"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <Separator />

            <div className="mt-3 pb-3 pr-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => deleteImage(previews.indexOf(selectedPreview))}
              >
                <Trash className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {previews.length < 5 && (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-y-2 rounded-lg bg-gray-500/10 h-[300px]  ${
            previews.length > 0 ? "hidden" : ""
          } outline-dashed outline-1 outline-gray-500/20 relative`}
        >
          <ImagePlus
            className=" size-10 text-gray-500"
            onClick={handleClickOpen}
          />
          <input
            {...getInputProps()}
            type="file"
            className="h-full w-full absolute opacity-0 cursor-pointer"
            style={{
              display: "block", //block!important isn't working
            }}
          />
          {isDragActive ? (
            <p>Drop the image!</p>
          ) : (
            <p className="text-center text-gray-500 px-3">
              <span className="font-semibold">Click here</span> or drag an image
              to upload it
            </p>
          )}
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {previews.length > 0 && (
        <div className="grid grid-cols-5 gap-2 w-full">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="h-14 relative border-2 hover:border-primary overflow-hidden rounded-sm"
            >
              <Image
                src={preview as string}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="rounded-sm cursor-pointer"
                onClick={() => setSelectedPreview(preview)}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          ))}

          {previews.length < 5 && (
            <div className="border-2 border-dashed  flex items-center justify-center rounded-sm hover:border-primary">
              <button
                type="button"
                className="w-full h-full flex justify-center items-center"
                onClick={handleClickOpen}
              >
                <Upload className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
