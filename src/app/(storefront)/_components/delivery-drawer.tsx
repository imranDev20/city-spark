"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const DeliveryDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [postcode, setPostcode] = useState("");
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };

    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    updateViewportHeight();

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );
    };
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className="p-0 overflow-y-auto overscroll-none min-h-[150px] max-h-[90vh]"
        style={{
          height: viewportHeight ? `${viewportHeight}px` : "auto",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="p-4 sticky top-0 bg-white z-10">
            <DrawerTitle>Delivery Options</DrawerTitle>
            <DrawerDescription>
              Enter your postcode to find delivery options in your area
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="postcode"
                  className="text-sm font-medium block mb-2"
                >
                  Enter your postcode
                </label>
                <div className="flex gap-2">
                  <Input
                    id="postcode"
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="flex-1 text-base"
                    style={{ fontSize: "16px" }}
                  />
                  <Button>Check</Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Find delivery options available in your area</span>
              </div>

              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DeliveryDrawer;
