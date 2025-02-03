"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import AccountDropdown from "./account-dropdown";
import SearchInput from "./search-input";
import CitySparkLogo from "./city-spark-logo";
import BasketPopup from "./basket-popup";
import DeliveryDialog from "./delivery-dialog";

export default function DesktopHeader() {
  return (
    <header className="w-full bg-primary py-2 hidden lg:block">
      <div className="container h-24 flex items-center justify-between mx-auto max-w-screen-xl gap-10">
        <Link
          href="/"
          className="flex items-center transition-colors duration-200 group"
        >
          <CitySparkLogo width={180} height={90} />
          <span className="sr-only">City Spark</span>
        </Link>

        <SearchInput />

        <div className="flex items-center space-x-5 text-white">
          <AccountDropdown />
          <Separator orientation="vertical" className="h-12 w-px bg-white" />

          <DeliveryDialog />

          <Separator orientation="vertical" className="h-12 w-px bg-white" />
          <BasketPopup />
        </div>
      </div>
    </header>
  );
}
