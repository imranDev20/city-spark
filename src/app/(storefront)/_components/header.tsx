"use client";

import { usePathname } from "next/navigation";
import MobileHeader from "./mobile-header";
import DesktopHeader from "./desktop-header";

export default function Header() {
  const pathname = usePathname();
  const isCheckoutPage = pathname.includes("/checkout");

  return (
    <>
      {!isCheckoutPage && <DesktopHeader />}
      <MobileHeader />
    </>
  );
}
