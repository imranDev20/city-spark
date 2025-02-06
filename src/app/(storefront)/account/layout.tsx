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
  FaBox,
  FaCog,
  FaShoppingCart,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    name: "Recent Orders",
    href: "/account/recent-orders",
    icon: FaBox,
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

  return (
    <div className="min-h-screen">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
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
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}

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
