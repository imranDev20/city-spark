"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { passwordFormSchema, PasswordFormValues } from "../schema";
import { changePassword } from "../actions";
import { Separator } from "@/components/ui/separator";

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authInfo: {
    hasPassword: boolean;
    providers: string[];
  };
}

export default function PasswordChangeDialog({
  open,
  onOpenChange,
  authInfo,
}: PasswordChangeDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasPassword } = authInfo;

  // Default values for the form
  const defaultValues: Partial<PasswordFormValues> = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      // Call the server action with direct data object
      const result = await changePassword({
        action: hasPassword ? "change" : "add",
        newPassword: data.newPassword,
        currentPassword: hasPassword ? data.currentPassword : undefined,
      });

      if (result.success) {
        toast({
          title: "Success",
          description:
            result.message ||
            (!hasPassword
              ? "Password has been added to your account"
              : "Your password has been updated successfully"),
          variant: "success",
        });
        onOpenChange(false);
        form.reset(defaultValues);
      } else {
        throw new Error(result.error || "Failed to update password");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="px-6 pt-6">
          <DialogHeader className="space-y-2 pb-1">
            <DialogTitle className="text-xl font-semibold">
              {!hasPassword ? "Add Password" : "Change Password"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {!hasPassword
                ? "Add a password to your account to enable direct login."
                : "Update your password to keep your account secure."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Separator />

        <div className="px-6 pt-1 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {hasPassword && (
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="password"
                            {...field}
                            className="h-10 pl-10 bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                            placeholder="Enter current password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          {...field}
                          className="h-10 pl-10 bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                          placeholder="Enter new password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          {...field}
                          className="h-10 pl-10 bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!hasPassword ? "Add Password" : "Change Password"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
