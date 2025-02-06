"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { FaSignOutAlt, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function LogoutDialog() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsPending(true);
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 mt-4 hover:bg-red-50 hover:text-red-600"
          disabled={isPending}
        >
          <FaSignOutAlt className="h-5 w-5 flex-shrink-0" />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100/80 flex items-center justify-center mb-4">
            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Are you sure you want to logout?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You will need to login again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
          <AlertDialogCancel className="mt-0 sm:mt-0" disabled={isPending}>
            <FaTimes className="mr-2 h-4 w-4" />
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                Logging out...
              </>
            ) : (
              <>
                <FaSignOutAlt className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
