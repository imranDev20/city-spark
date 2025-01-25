"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import DeliveryDrawer from "../../_components/delivery-drawer";

export default function BasketHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="w-full lg:hidden relative">
        <div
          className={cn(
            "fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200",
            isScrolled && "shadow-md"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                My Basket
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-primary/5 h-10"
                onClick={() => setIsDrawerOpen(true)}
              >
                <span className="text-base">Change</span>
                <MapPin className="!size-5" />
              </Button>
            </div>
          </div>
          <div
            className="absolute bottom-0 translate-y-full w-full h-4 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.05), transparent)",
            }}
          />
        </div>
        <div className="h-16" />
      </header>

      <DeliveryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
