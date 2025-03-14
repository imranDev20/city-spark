"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
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
import { LoginFormData, loginSchema } from "../schema";
import GoogleIcon from "@/components/icons/google";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");
  const decodedUrl = callbackUrl
    ? decodeURIComponent(decodeURIComponent(callbackUrl))
    : null;
  const isAdminRedirect = decodedUrl?.includes("/admin");

  console.log(decodedUrl);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormData) {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast({
            title: "Login Failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: "You have been logged in successfully.",
            variant: "success",
          });
          router.push("/"); // Redirect to dashboard or home page
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        await signIn("google", { callbackUrl: "/" });
      } catch (error) {
        console.error("Google sign-in error:", error);

        toast({
          title: "Sign-in Error",
          description:
            "An error occurred during Google sign-in. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <main className="container max-w-lg mx-auto py-20">
      <Card className="shadow bg-white p-10">
        <h1 className="lg:text-4xl font-extrabold mb-2">Login</h1>

        <div className="mb-10">
          <p className="mb-5 text-sm">
            Not registered yet?{" "}
            <Link
              href="/register"
              className="text-secondary font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        {searchParams.get("registered") === "true" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-10">
            <p className="text-green-800 text-sm">
              Account successfully created! Please log in with your credentials.
            </p>
          </div>
        )}

        {isAdminRedirect && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">
                Administrator privileges are required to access this area.
                Please log in with an admin account.
              </p>
            </div>
          </div>
        )}

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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="h-10 pl-10 bg-muted rounded-sm border border-transparent hover:border-gray-300 focus-visible:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-placeholder"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-secondary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-10" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full h-10"
            onClick={handleGoogleSignIn}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <GoogleIcon height={24} width={24} className="mr-2" />
                Sign in with Google
              </>
            )}
          </Button>
        </div>
      </Card>
    </main>
  );
}
