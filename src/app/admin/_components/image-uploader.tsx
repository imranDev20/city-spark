"use-client";
import React, { useContext } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";

import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { userSchema } from "../users/new/schema";

export const ImageUploader: React.FC = () => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");
   const  {control,} = useFormContext<z.infer<typeof userSchema>>();
  const formSchema = z.object({
    image: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
        console.log(`acceptedFiles`, acceptedFiles);
      } catch (error) {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success(`Image uploaded successfully 🎉 ${values.image.name}`);
  };

  return (
 
    
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto ">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                <h2 className="text-xl font-semibold tracking-tight">
                
                  <span
                    className={
                      form.formState.errors.image || fileRejections.length !== 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  ></span>
                </h2>
              </FormLabel>
              <FormControl>
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
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Image must be less than 1MB and of type png, jpg, or jpeg
                  </p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
  );
};

