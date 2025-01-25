"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import CitySparkLogoBlack from "./city-spark-logo-black";
import MobileMenu from "./mobile-menu";
import FilterDrawer from "./filter-drawer";
import BasketDrawer from "./basket-drawer";

interface MobileHeaderProps {
  isCategoriesPage?: boolean;
}

export default function MobileHeader({
  isCategoriesPage = false,
}: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <div className="pt-16 bg-white mt-1">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              placeholder="Search for products"
              className="w-full pl-12 pr-12 h-12 rounded-full border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <FilterDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
