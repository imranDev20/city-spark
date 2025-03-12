"use client";

import { usePathname } from "next/navigation";
import DesktopHeaderFallback from "./desktop-header-fallback";
import MobileHeader from "./mobile-header";

export default function HeaderFallback() {
  const pathname = usePathname();
  const isCheckoutPage = pathname.includes("/checkout");

  return (
    <>
      {!isCheckoutPage && <DesktopHeaderFallback />}
      <MobileHeader />
    </>
  );
}
