"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginForm from "./login-form";

export default function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="py-6 items-center ml-10 mr-2 hover:bg-primary/10"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-2">
            <p className="text-xs text-neutral-500">Hello, User</p>
            <p className="text-sm">Account & Orders</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[800px] p-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="grid grid-cols-2">
          <div className="bg-primary/10">1</div>
          <div className="p-10">
            <DialogHeader className="mb-6">
              <DialogTitle className="mb-4 text-2xl">Login</DialogTitle>
              <DialogDescription>
                Login to make an order, access your orders, special offers,
                health tips, and more!
              </DialogDescription>
            </DialogHeader>

            <LoginForm />

            <p className="text-sm text-neutral-500 mt-5">
              By continuing you agree to{" "}
              <span className="text-primary">Terms & Conditions</span>,{" "}
              <span className="text-primary">Privacy Policy</span> &
              <span className="text-primary"> Refund-Return Policy</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
