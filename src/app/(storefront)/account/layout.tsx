"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FaUser,
  FaHeart,
  FaTachometerAlt,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCog,
  FaShoppingCart,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/account",
    icon: FaTachometerAlt,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: FaShoppingCart,
  },
  {
    name: "Wishlist",
    href: "/account/wishlist",
    icon: FaHeart,
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: FaMapMarkerAlt,
  },
  {
    name: "Profile",
    href: "/account/profile",
    icon: FaUser,
  },
  {
    name: "Settings",
    href: "/account/settings",
    icon: FaCog,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  const NavLink = ({
    item,
    className,
    isMobile = false,
  }: {
    item: (typeof navigation)[0];
    className?: string;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "flex flex-col items-center rounded-lg transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-gray-700 hover:bg-gray-100",
          isMobile ? "p-3 gap-2" : "flex-row gap-3 px-4 py-2.5",
          className
        )}
      >
        <item.icon
          className={cn("flex-shrink-0", isMobile ? "h-6 w-6" : "h-5 w-5")}
        />
        <span className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        {/* Mobile Navigation Slider */}
        <div className="lg:hidden mb-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="flex-[0_0_28%] min-w-0 pl-4 first:pl-0"
                >
                  <NavLink
                    item={item}
                    className="whitespace-nowrap"
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <Card className="sticky top-8 p-4 bg-white">
              <div className="flex items-center gap-3 px-2 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaUser className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">John Doe</p>
                  <p className="text-sm text-muted-foreground truncate">
                    john.doe@example.com
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} isMobile={false} />
                ))}

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-4 mt-4 hover:bg-red-50 hover:text-red-600"
                >
                  <FaSignOutAlt className="h-5 w-5 flex-shrink-0" />
                  Logout
                </Button>
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
