"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import AccountDropdown from "./account-dropdown";
import SearchInput from "./search-input";
import CitySparkLogo from "./city-spark-logo";
import BasketPopup from "./basket-popup";
import DeliveryDialog from "./delivery-dialog";
import { cn } from "@/lib/utils";
import { FaTruck } from "react-icons/fa";
import { useDeliveryStore } from "@/hooks/use-delivery-store";
import { useState } from "react";

export default function DesktopHeader() {
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

        <SearchInput />

        <div className="flex items-center space-x-5 text-white">
          <AccountDropdown />
          <Separator orientation="vertical" className="h-12 w-px bg-border" />

          <button
            onClick={() => setOpenDeliveryDialog(true)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-primary rounded-md transition-colors duration-200",
              "hover:bg-primary/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            )}
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

          <Separator orientation="vertical" className="h-12 w-px bg-border" />
          <BasketPopup />
        </div>
      </div>
    </header>
  );
}
