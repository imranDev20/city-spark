"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = {
  email: string;
  password: string;
  surname: string;
  firstName: string;
  confirmPassword: string;
};
export default function RegisterForm() {
  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one digit",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 p-5 space-y-5">
        <h3 className="mb-10 text-2xl font-semibold">Register account</h3>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            {...register("firstName")}
            type="text"
            id="firstName"
            placeholder="Enter your First Name"
            required
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="surname">Surname</Label>
          <Input
            {...register("surname")}
            type="text"
            id="surname"
            placeholder="Enter your Surname"
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            type="email"
            id="email"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your Password"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Enter your Password"
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <input
          type="submit"
          className="text-white bg-secondary mt-3 py-2 px-3 mb-2 rounded-md font-semibold w-full"
          value="Register"
        />
        <p className="text-sm">
          If you already have an account. Please{" "}
          <span className="hover:underline text-secondary">
            <Link href="/login">LogIn here</Link>
          </span>
        </p>
      </form>
    </>
  );
}
