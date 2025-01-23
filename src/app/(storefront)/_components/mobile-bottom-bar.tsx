"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Store,
  ShoppingCart,
  UserCircle2,
  Search,
  MapPin,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type MobileBottomBarProps = {
  isShowInProductPage?: boolean;
};

const DeliveryDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [postcode, setPostcode] = useState("");

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Delivery Options</DrawerTitle>
            <DrawerDescription>
              Enter your postcode to find delivery options in your area
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="postcode"
                  className="text-sm font-medium block mb-2"
                >
                  Enter your postcode
                </label>
                <div className="flex gap-2">
                  <Input
                    id="postcode"
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="flex-1"
                  />
                  <Button>Check</Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Find delivery options available in your area</span>
              </div>

              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MobileBottomBar = ({
  isShowInProductPage = false,
}: MobileBottomBarProps) => {
  const pathname = usePathname();
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Store },
    {
      name: "Delivery",
      onClick: () => setIsDeliveryOpen(true),
      icon: MapPin,
    },
    { name: "Account", href: "/account", icon: UserCircle2 },
    { name: "Search", href: "/products?search=''", icon: Search },
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  const shouldHideBottomBar = () => {
    const excludedPaths = ["/login", "/register"];
    const productPaths = ["/products", "/products/c/", "/products/p/"];

    if (excludedPaths.some((path) => pathname === path)) return true;
    if (isShowInProductPage)
      return excludedPaths.some((path) => pathname === path);
    if (productPaths.some((path) => pathname.startsWith(path))) return true;
    return false;
  };

  if (shouldHideBottomBar()) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="h-16 bg-white border-t border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <nav className="h-full">
            <ul className="h-full flex items-center justify-around px-4">
              {navigation.map((item) => (
                <li key={item.name} className="flex-1">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1",
                        "transition-colors duration-200",
                        isActive(item.href)
                          ? "text-secondary"
                          : "text-gray-500 hover:text-secondary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-secondary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </div>

      <DeliveryDrawer
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
      />
    </>
  );
};

export default MobileBottomBar;
