"use client";

import Link from "next/link";
import { FaTruck } from "react-icons/fa";
import CitySparkLogo from "./city-spark-logo";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeliveryDialog from "./delivery-dialog";
import { useDeliveryStore } from "@/hooks/use-delivery-store";
import { useState } from "react";
import AccountDropdown from "./account-dropdown";
import BasketPopup from "./basket-popup";

export default function DesktopHeaderFallback() {
  const { postcode } = useDeliveryStore();
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState<boolean>(false);

  return (
    <header className="w-full bg-white py-2 hidden lg:block border-b">
      <div className="container h-24 flex items-center justify-between mx-auto max-w-screen-xl gap-10">
        <Link
          href="/"
          className="flex items-center transition-colors duration-200 group lg:min-w-56"
        >
          <CitySparkLogo width={130} />
          <span className="sr-only">City Spark</span>
        </Link>

        {/* Disabled search input */}
        <div className="flex-1 relative max-w-2xl mx-auto">
          <div className="relative">
            <div className="flex h-12 items-center bg-gray-100 rounded-md border shadow-sm">
              <div className="px-4 text-primary border-r">
                <Search className="h-5 w-5" />
              </div>
              <div className="relative flex-1">
                <input
                  className="h-full border-0 bg-transparent px-4 w-full py-2 outline-none cursor-not-allowed"
                  placeholder="Search for products"
                  disabled
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-12 px-6 rounded-none rounded-r-md opacity-70 cursor-not-allowed"
                disabled
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-7 text-white">
          <AccountDropdown />

          <button
            onClick={() => setOpenDeliveryDialog(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-primary rounded-md transition-colors duration-200 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <FaTruck className="h-8 w-8" />
            <span className="text-base font-semibold">Delivery</span>
            <span className="text-xs font-light -mt-1">
              {postcode || "Postcode"}
            </span>
          </button>

          <DeliveryDialog
            open={openDeliveryDialog}
            setOpen={setOpenDeliveryDialog}
          />

          <BasketPopup />
        </div>
      </div>
    </header>
  );
}
