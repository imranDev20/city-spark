"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function DeliveryLocation() {
  const [postcode, setPostcode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = () => {
    console.log("Postcode submitted:", postcode);
    setIsOpen(false);
  };

  const Content = () => (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        <MapPin className="h-5 w-5 flex-shrink-0" />
        <p>
          This helps us show you products available in your area and calculate
          delivery times.
        </p>
      </div>

      <div>
        <label htmlFor="postcode" className="text-sm font-medium mb-1.5 block">
          Your Postcode
        </label>
        <div className="flex gap-2">
          <Input
            id="postcode"
            placeholder="e.g. SW1A 1AA"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            className="text-lg"
          />
          <Button onClick={handleSubmit} disabled={!postcode}>
            Check
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        By entering your postcode, you&apos;ll see accurate delivery times and
        availability for your location.
      </div>
    </div>
  );

  const Trigger = (
    <button className="w-full p-4 text-left transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-full shadow-sm">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Select Delivery Location
            </h3>
            <p className="text-sm text-gray-600">
              Enter your postcode for local availability
            </p>
          </div>
        </div>
        {!isMobile && (
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">
              Add Postcode
            </span>
          </div>
        )}
      </div>
    </button>
  );

  return (
    <Card className="shadow-none mb-6">
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Enter Delivery Location</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <Content />
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full mt-4">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{Trigger}</DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Enter Delivery Location
              </DialogTitle>
            </DialogHeader>
            <Content />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
