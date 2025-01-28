"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import CitySparkLogoBlack from "./city-spark-logo-black";
import MobileMenu from "./mobile-menu";
import FilterDrawer from "./filter-drawer";
import BasketDrawer from "./basket-drawer";
import SearchOverlay from "./search-overlay";

interface MobileHeaderProps {
  isCategoriesPage?: boolean;
}

export default function MobileHeader({
  isCategoriesPage = false,
}: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      searchInputRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  const excludedRoutes = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/basket",
    "/products/p",
    ...(isCategoriesPage ? [] : ["/products/c", "/products"]),
  ];

  const isExcluded = excludedRoutes.some((route) => pathname.startsWith(route));

  if (isExcluded) {
    return null;
  }

  return (
    <header className="w-full lg:hidden">
      <div
        className={cn(
          "fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200",
          isScrolled && "shadow-md"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <MobileMenu />

            <Link href="/" className="flex items-center">
              <CitySparkLogoBlack height={55} width={95} />
              <span className="sr-only">City Spark</span>
            </Link>

            <BasketDrawer />
          </div>
        </div>
      </div>
      // Replace the search input section with:
      <div className="pt-16 bg-white mt-1">
        <div className="container mx-auto px-4">
          <SearchOverlay />
        </div>
      </div>
    </header>
  );
}
