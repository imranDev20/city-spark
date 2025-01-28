"use client";

import Link from "next/link";
import { ShoppingCart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "@/services/cart";
import CitySparkLogo from "../../_components/city-spark-logo";

export default function CheckoutHeader() {
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const cartItemCount = cart?.cartItems?.length || 0;

  return (
    <header className="bg-primary">
      <div className="container max-w-screen-xl mx-auto h-16 flex items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <CitySparkLogo width={100} height={50} />
          <span className="sr-only">City Spark</span>
        </Link>

        <div className="flex items-center">
          <div className="flex items-center gap-1.5 text-white/70 mr-12">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">Secure Checkout</span>
          </div>

          <Link
            href="/basket"
            className="flex items-center justify-center w-10 h-10 text-white hover:text-white/90 transition-colors rounded-full hover:bg-white/10"
            aria-label="View basket"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
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
          </Link>
        </div>
      </div>
    </header>
  );
}
