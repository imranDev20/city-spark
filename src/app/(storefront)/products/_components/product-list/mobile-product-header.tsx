"use client";

import BasketDrawer from "@/app/(storefront)/_components/basket-drawer";
import SearchOverlay from "@/app/(storefront)/_components/search-overlay";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/hooks/use-search-store";
import { cn } from "@/lib/utils";
import { ChevronLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileNavigationHeaderProps {
  isProductDetailsPage?: boolean;
}

export default function MobileProductHeader({
  isProductDetailsPage = false,
}: MobileNavigationHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsOpen } = useSearchStore(); // Get the setIsOpen function from our store

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="w-full lg:hidden">
        <div
          className={cn(
            "fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200",
            isScrolled && "shadow-md"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => router.back()}
              >
                <ChevronLeft className="!size-6" />
                <span className="sr-only">Go back</span>
              </Button>

              {!isProductDetailsPage ? (
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 !size-5 text-muted-foreground" />
                  <input
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-4 h-11 rounded-full border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                    onFocus={() => setIsOpen(true)}
                    readOnly // Make input readonly since we're using the overlay
                  />
                </div>
              ) : (
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
                  Product Details
                </h3>
              )}

              <div
                className={cn(
                  "flex-shrink-0",
                  isProductDetailsPage && "ml-auto"
                )}
              >
                <BasketDrawer />
              </div>
            </div>
          </div>
        </div>
        {/* Shadow element that appears below fixed header */}
        <div className="h-16" />
        <div className="h-4 bg-gradient-to-b from-black/5 to-transparent" />
      </header>

      {/* Include the SearchOverlay component */}
      <SearchOverlay showInitialSearch={false} />
    </>
  );
}
