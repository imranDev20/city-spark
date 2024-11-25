"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import AccountDropdown from "./account-dropdown";
import SearchInput from "./search-input";
import { cn } from "@/lib/utils";
import CitySparkLogo from "./city-spark-logo";

function DesktopHeader() {
  const cartItemCount = 0;

  return (
    <header className="w-full bg-primary py-2 hidden lg:block">
      <div className="container h-16 flex items-center justify-between mx-auto max-w-screen-xl">
        <Link
          href="/"
          className="flex items-center transition-colors duration-200 group"
        >
          <CitySparkLogo />
          <span className="sr-only">City Spark</span>
        </Link>

        <SearchInput />

        <div className="flex items-center space-x-5 text-white">
          <AccountDropdown />
          <Separator orientation="vertical" className="h-6 w-px bg-white" />
          <Link
            href="/basket"
            className="flex items-center group cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 group-hover:text-secondary transition-colors duration-200" />
              {cartItemCount > 0 && (
                <span
                  className={cn(
                    "absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center",
                    cartItemCount > 9 ? "w-5 h-5 text-[10px]" : "w-4 h-4"
                  )}
                >
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="ml-2 text-base group-hover:text-secondary transition-colors duration-200">
              Basket
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return <DesktopHeader />;
}
