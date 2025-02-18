"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AuthenticationBanner() {
  const { status } = useSession();

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    <div className="bg-blue-50 p-5 rounded-lg mb-10 border border-blue-200 shadow">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
          <CircleAlert className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-700">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Sign in
            </Link>{" "}
            or{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              create an account
            </Link>{" "}
            to access exclusive benefits and faster checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
