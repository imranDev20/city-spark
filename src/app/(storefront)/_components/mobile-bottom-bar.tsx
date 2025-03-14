"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import DeliveryDrawer from "./delivery-drawer";
import {
  FaHome,
  FaStore,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

type MobileBottomBarProps = {
  isShowInProductPage?: boolean;
};

const MobileBottomBar = ({
  isShowInProductPage = false,
}: MobileBottomBarProps) => {
  const pathname = usePathname();
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", Icon: FaHome },
    { name: "Products", href: "/products", Icon: FaStore },
    {
      name: "Delivery",
      onClick: () => setIsDeliveryOpen(true),
      Icon: FaMapMarkerAlt,
    },
    { name: "Basket", href: "/basket", Icon: FaShoppingCart },
    { name: "Account", href: "/account", Icon: FaUser },
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  const shouldHideBottomBar = () => {
    const excludedPaths = ["/login/", "/register/", "/checkout/"];
    const productPaths = ["/products/", "/products/c/", "/products/p/"];

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
        <div className="h-16 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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
                      <item.Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-secondary"
                    >
                      <item.Icon className="h-5 w-5" />
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
