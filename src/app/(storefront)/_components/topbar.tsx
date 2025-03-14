"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHelpCircle,
  FiPhone,
  FiTruck,
  FiFacebook,
  FiInstagram,
} from "react-icons/fi";
import { RiTwitterXLine } from "react-icons/ri";

function DesktopTopbar() {
  return (
    <div className="bg-primary text-white/90 py-1.5 px-4 text-sm hidden lg:block">
      <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
        <div className="flex items-center space-x-6">
          <Link
            href="/track-order"
            className="flex items-center hover:text-secondary transition-colors"
          >
            <FiTruck size={16} className="mr-1.5" />
            <span>Track Your Order</span>
          </Link>
          <Link
            href="/faqs"
            className="flex items-center hover:text-secondary transition-colors"
          >
            <FiHelpCircle size={16} className="mr-1.5" />
            <span>FAQs</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="tel:02070189347"
            className="flex items-center hover:text-secondary transition-colors"
          >
            <FiPhone size={16} className="mr-1.5" />
            <span>020 7018 9347</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:text-secondary transition-colors"
            >
              <FiFacebook size={16} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-secondary transition-colors"
            >
              <FiInstagram size={16} />
            </Link>
            <Link
              href="https://x.com"
              target="_blank"
              className="hover:text-secondary transition-colors"
            >
              <RiTwitterXLine size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const isCheckoutPage = pathname.includes("/checkout");

  if (isCheckoutPage) {
    return null;
  }

  return <DesktopTopbar />;
}
