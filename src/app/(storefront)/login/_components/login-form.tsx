"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const registrationSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Incorrect Password"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="lg:w-1/2 p-12">
        <h3 className="mb-8 text-2xl font-semibold">Log in to your account</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
          />
          {errors.email && (
            <span className="text-primary text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="grid w-full max-w-sm mt-4 items-center gap-1.5 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-2 top-8"
          >
            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
          {errors.password && (
            <span className="text-primary text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <div>
          <button className="hover:underline text-sm relative mt-1 left-36">
            <Link href="/forgot-password">Forgot Password?</Link>
          </button>
        </div>
        <input
          type="submit"
          className="text-white bg-secondary mt-3 py-2 px-3 mb-2 rounded-md font-semibold w-full"
          value="Log In"
        />
        <p className="text-sm">
          If you do not have an account, please{" "}
          <span className="hover:underline text-blue-700">
            <Link href="/register">Register here</Link>
          </span>
        </p>
      </form>
    </>
  );
}
