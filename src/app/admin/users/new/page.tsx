"use client";

import Link from "next/link";
import React, { Fragment, useState, useTransition } from "react";
import { ChevronLeft, Trash } from "lucide-react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FromInputType, userSchema } from "../schema";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createUser } from "../actions";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  FileState,
  SingleImageDropzone,
} from "@/components/custom/single-image-uploader";
import { useEdgeStore } from "@/lib/edgestore";
import UserForm from "../_components/user-form";
const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Create User", href: "/admin/users/new", isCurrentPage: true },
];

export default function CreateUserPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();
  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);

      if (newFileState) {
        newFileState.progress = progress;
      }

      console.log(newFileState);
      return newFileState;
    });
  }

  const form = useForm<FromInputType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      address: [
        {
          city: "",
          postalCode: "",
          state: "",
          addressLine1: "",
          addressLine2: "",
          country: "",
        },
      ],
    },
  });
  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "address",
  });

  const onCreateUserSubmit: SubmitHandler<FromInputType> = async (data) => {
    startTransition(async () => {
      const result = await createUser(data);

      if (result.success) {
        toast({
          title: "Create User",
          description: result.message,
          variant: "success",
        });

        router.push("/admin/users");
      } else {
        toast({
          title: "Users Saved failed",
          description: result.message,
          variant: "destructive",
        });
        console.error(result.message);
      }
    });
  };

  return (
    <ContentLayout title="Create User" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <UserForm />
    </ContentLayout>
  );
}
