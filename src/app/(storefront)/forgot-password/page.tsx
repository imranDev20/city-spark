"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useToast } from "@/components/ui/use-toast";
import { forgotPassword } from "./actions";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      const result = await forgotPassword(values.email);
      if (result.success) {
        toast({
          title: "Reset link sent",
          description: "Check your email for the password reset link.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container max-w-lg mx-auto py-20">
      <Card className="shadow bg-white p-10">
        <h1 className="lg:text-4xl font-extrabold mb-2">Forgot Password</h1>

        <div className="mb-10">
          <p className="mb-5 text-sm">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-secondary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="h-10 pl-10 bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          We'll send you an email with a link to reset your password.
        </p>
      </Card>
    </main>
  );
}
