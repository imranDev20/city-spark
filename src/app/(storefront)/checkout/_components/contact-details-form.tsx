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
import { AsYouType } from "libphonenumber-js";

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
}

export function ContactDetailsForm({ onNext }: ContactDetailsFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactDetailsFormInput>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  console.log(session);

  useEffect(() => {
    if (session?.user || getStoredContactDetails()) {
      console.log(session?.user.email);
      form.reset({
        firstName:
          session?.user?.firstName ||
          getStoredContactDetails()?.firstName ||
          "",
        lastName:
          session?.user?.lastName || getStoredContactDetails()?.lastName || "",
        email: session?.user?.email || getStoredContactDetails()?.email || "",
        phone: session?.user?.phone || getStoredContactDetails()?.phone || "",
      });
    }
  }, [session?.user]);

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

      const userId = session?.user?.id || getGuestUserId() || null;

      // If no userId and no session, create new guest
      if (!userId && !session?.user) {
        const guestResult = await createGuestUser({
          ...values,
        });

        if (!guestResult.success) {
          throw new Error(guestResult.message);
        }

        const newGuestId = guestResult.data?.id;
        if (!newGuestId) {
          throw new Error("Failed to create guest user");
        }

        sessionStorage.setItem("guest_user_id", newGuestId);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));

        handleNext();
        return;
      }

      // Update existing user (guest or authenticated)
      if (userId) {
        const updateResult = await updateContactDetails({
          userId,
          ...values,
        });

        if (!updateResult.success) {
          throw new Error(updateResult.message);
        }

        // Store values for guest users
        if (!session?.user) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        }
      }

      handleNext();
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
                        disabled={isLoading}
                        {...field}
                        className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
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
                        className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
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
                      className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
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
                      placeholder="+44 XXXX XXX XXX"
                      {...field}
                      className="bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                      onChange={(e) => {
                        const formatter = new AsYouType("GB");
                        const formatted = formatter.input(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>

        <div className="px-6 py-4 border-t flex justify-end items-center">
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
