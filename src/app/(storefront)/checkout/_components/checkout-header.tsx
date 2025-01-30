"use client";

import Link from "next/link";
import { ShoppingCart, Shield, ChevronLeft, ArrowLeft } from "lucide-react";
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
    <header>
      <div className="bg-primary">
        <div className="container max-w-screen-xl mx-auto flex items-center justify-between px-4 lg:px-8">
          {/* Mobile View */}
          <div className="lg:hidden flex items-center justify-between w-full h-14">
            <Link
              href="/basket"
              className="flex items-center text-white/90 hover:text-white"
            >
              <ChevronLeft className="!size-6" />
              {/* <span className="text-sm font-medium">Back to basket</span> */}
            </Link>

            <div className="flex items-center justify-center">
              <Link href="/">
                <CitySparkLogo width={70} height={35} />
              </Link>
            </div>

            <div className="relative">
              <Link
                href="/basket"
                className="flex items-center justify-center w-8 h-8 text-white hover:text-white/90 transition-colors"
                aria-label="View basket"
              >
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
              </Link>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex items-center justify-between w-full h-16">
            <Link href="/" className="flex items-center">
              <CitySparkLogo width={90} height={45} />
              <span className="sr-only">City Spark</span>
            </Link>

            <div className="flex items-center">
              <div className="flex items-center gap-1.5 text-white/70 mr-12">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Checkout</span>
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
        </div>
      </div>

      {/* Mobile Secure Checkout Banner */}
      <div className="lg:hidden bg-primary/5 border-b">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-center gap-1.5 py-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-gray-700">
              Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
