"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ContactDetailsFormInput, contactDetailsSchema } from "../schema";
import { createGuestUser, updateContactDetails } from "../actions";

const STORAGE_KEY = "checkout_contact_details";

function getStoredContactDetails() {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function getGuestUserId() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("guest_user_id");
}

interface ContactDetailsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContactDetailsForm({
  onNext,
  onBack,
}: ContactDetailsFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactDetailsFormInput>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      firstName:
        session?.user?.firstName || getStoredContactDetails()?.firstName || "",
      lastName:
        session?.user?.lastName || getStoredContactDetails()?.lastName || "",
      email: session?.user?.email || getStoredContactDetails()?.email || "",
      phone: session?.user?.lastName || getStoredContactDetails()?.phone || "",
    },
  });

  // Save form data to session storage as user types
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).some(Boolean)) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: ContactDetailsFormInput) {
    try {
      setIsLoading(true);

      if (!session?.user) {
        const existingGuestId = getGuestUserId();

        if (existingGuestId) {
          // Update existing guest user
          const updateResult = await updateContactDetails({
            userId: existingGuestId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
          });

          if (!updateResult.success) {
            throw new Error(updateResult.message);
          }
        } else {
          // Create new guest user
          const guestResult = await createGuestUser({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
          });

          if (!guestResult.success) {
            throw new Error(guestResult.message);
          }

          // Store the new guest user ID
          sessionStorage.setItem("guest_user_id", guestResult.data?.id || "");
        }

        // Store the contact details
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        handleNext();
      } else {
        handleNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle successful form submission
  const handleNext = () => {
    toast({
      title: "Success",
      description: "Contact details saved successfully",
      variant: "success",
    });
    onNext();
  };

  console.log(session);

  // Helper component for required field indicator
  const RequiredIndicator = () => (
    <span className="text-red-500 ml-0.5">*</span>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-1">
            <CardTitle className="text-2xl">Contact Details</CardTitle>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Please enter your contact information below
          </p>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent>
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      First Name
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        className="border-gray-300"
                        disabled={isLoading}
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Last Name
                      <RequiredIndicator />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        className="border-gray-300"
                        disabled={isLoading}
                        {...field}
                      />
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
                  <FormLabel className="text-sm font-medium">
                    Email Address
                    <RequiredIndicator />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="border-gray-300"
                      disabled={isLoading || !!session?.user}
                      {...field}
                    />
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
                  <FormLabel className="text-sm font-medium">
                    Phone Number
                    <RequiredIndicator />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      className="border-gray-300"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>

        <div className="px-6 py-4 bg-gray-50/50 border-t flex justify-end items-center">
          <Button type="submit" className="min-w-[100px]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
