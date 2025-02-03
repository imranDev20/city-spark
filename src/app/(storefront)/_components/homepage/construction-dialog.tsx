"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";

export default function ConstructionDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenDialog = localStorage.getItem("hasSeenConstructionDialog");
    if (!hasSeenDialog) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenConstructionDialog", "true");
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-[500px]">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Website Under Construction
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2 pb-4">
            <p className="mb-4">
              Please note that this website is currently under development. Some
              features may not be fully functional, and prices/offers shown are
              for demonstration purposes only.
            </p>
            <p>
              We appreciate your understanding as we work to improve your
              experience. Feel free to explore, but please be aware that actual
              transactions cannot be processed at this time.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-center">
          <AlertDialogCancel
            onClick={handleClose}
            className="rounded-lg mt-0 sm:mt-0 w-full sm:w-auto"
          >
            I Understand
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
