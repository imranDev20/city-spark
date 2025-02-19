"use client";

import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaTruckMoving,
  FaPencilAlt,
  FaStore,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import DeliveryDialog from "@/app/(storefront)/_components/delivery-dialog";
import { useDeliveryStore } from "@/hooks/use-delivery-store";

interface ContentProps {
  postcode: string;
  setPostcode: (postcode: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const Content = ({ postcode, setPostcode, setIsOpen }: ContentProps) => (
  <div className="p-4 space-y-4">
    <div className="space-y-2">
      <label htmlFor="postcode" className="font-medium text-sm">
        Postcode
      </label>
      <div className="flex gap-2">
        <Input
          id="postcode"
          placeholder="Enter postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
        />
        <Button onClick={() => setIsOpen(false)} disabled={!postcode}>
          Check
        </Button>
      </div>
    </div>
  </div>
);

export default function FulfillmentOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState<boolean>(false);
  const { postcode, setPostcode } = useDeliveryStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDeliveryClick = () => {
    if (isMobile) {
      setIsOpen(true);
    } else {
      setOpenDeliveryDialog(true);
    }
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Card */}
        <Card className="bg-white shadow overflow-hidden">
          <button
            onClick={handleDeliveryClick}
            className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-3">
                  <FaTruckMoving className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {postcode
                      ? `Delivery to ${postcode}`
                      : "Add delivery postcode"}
                  </span>
                </div>
                <span className="text-sm text-gray-500 pl-8">
                  {postcode
                    ? "Next day delivery available"
                    : "Check delivery availability"}
                </span>
              </div>
              {postcode ? (
                <FaPencilAlt className="h-4 w-4 text-gray-400" />
              ) : (
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </button>
        </Card>

        {/* Collection Card */}
        <Card className="bg-white shadow">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-3">
                  <FaStore className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Collection from store</span>
                </div>
                <span className="text-sm text-gray-500 pl-8">
                  123 High Street, London SW1A 1AA
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b">
              <DrawerTitle>Enter Your Postcode</DrawerTitle>
            </DrawerHeader>
            <Content
              postcode={postcode}
              setPostcode={setPostcode}
              setIsOpen={setIsOpen}
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <DeliveryDialog
          open={openDeliveryDialog}
          setOpen={setOpenDeliveryDialog}
        />
      )}
    </div>
  );
}
