"use client";

import React, { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { RegisterFormData, registerSchema } from "../schema";
import GoogleIcon from "@/components/icons/google";
import { createUser } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AsYouType } from "libphonenumber-js";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Add this state
  const [isFocused, setIsFocused] = useState(false);

  // Add validation states
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Add this to update validation on password change
  useEffect(() => {
    const password = form.getValues("password");
    setPasswordCriteria({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    });
  }, [form.watch("password")]);

  console.log(form.formState.errors);

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    startTransition(async () => {
      try {
        const result = await createUser(data);

        if (result.success) {
          toast({
            title: "Registration Successful",
            description: result.message,
            variant: "success",
          });
          form.reset();

          router.push("/login?registered=true");
        } else {
          toast({
            title: "Registration Failed",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Unexpected error during registration:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <main className="container max-w-md mx-auto py-20">
      <h1 className="lg:text-4xl font-extrabold mb-2">Register</h1>
      <p className="mb-10 text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-secondary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Surname" {...field} />
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
                  <Input
                    type="email"
                    placeholder="Enter your Email"
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+44 XXXX XXX XXX"
                    {...field}
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      onFocus={() => setIsFocused(true)}
                      {...field}
                      onBlur={() => setIsFocused(false)}
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
                    {isFocused && (
                      <div className="absolute left-[calc(100%+12px)] top-0 bg-white p-4 rounded-lg shadow-lg border space-y-2 text-sm w-80 z-10">
                        {/* Arrow */}
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-8 border-transparent border-r-white z-10" />
                        <div className="absolute left-0 top-1/2 -translate-x-[calc(50%+1px)] -translate-y-1/2 w-0 h-0 border-8 border-transparent border-r-gray-200" />

                        {/* Criteria list */}
                        <div
                          className={`flex items-center gap-2 ${
                            passwordCriteria.length
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {passwordCriteria.length ? "✓" : "○"} At least 8
                          characters
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordCriteria.lowercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {passwordCriteria.lowercase ? "✓" : "○"} One lowercase
                          letter
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordCriteria.uppercase
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {passwordCriteria.uppercase ? "✓" : "○"} One uppercase
                          letter
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordCriteria.number
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {passwordCriteria.number ? "✓" : "○"} One number
                        </div>
                        <div
                          className={`flex items-center gap-2 ${
                            passwordCriteria.special
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {passwordCriteria.special ? "✓" : "○"} One special
                          character (@$!%*?&)
                        </div>
                      </div>
                    )}
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your Password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            <>
              <GoogleIcon height={24} width={24} className="mr-2" />
              Sign up with Google
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
