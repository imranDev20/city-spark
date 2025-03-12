"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaLock, FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/services/account-profile";
import { ProfileFormValues, profileSchema } from "./schema";
import { updateProfile } from "./actions";

export default function AccountProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });

  // Query for user profile data
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    enabled: !!session?.user,
  });

  // Populate form with profile data when available
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
  }, [profile, form]);

  // Submit handler using server action with transition
  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateProfile(data);

        if (result.success) {
          await queryClient.invalidateQueries({ queryKey: ["user-profile"] });

          toast({
            title: "Success",
            description: "Your profile has been updated successfully.",
            variant: "success",
          });
          setEditMode(false);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update profile",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Failed to load profile"}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Consistent with other account pages */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 flex items-center justify-center rounded-full">
              <FaUser className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-primary-foreground/90 mt-1">
                Update your personal information and account security
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Your name and contact details
              </p>
            </div>
            {!editMode && (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>

          {editMode ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+44 7700 900000"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !form.formState.isDirty}
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">First Name</p>
                  <p className="text-lg font-medium">
                    {profile?.firstName || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Last Name</p>
                  <p className="text-lg font-medium">
                    {profile?.lastName || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{profile?.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-lg font-medium">
                  {profile?.phone || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-xl">
              <FaLock className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Change your password to keep your account secure
                </p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
