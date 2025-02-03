import Header from "./_components/header";
import StoreTopLoader from "./_components/store-top-loader";
import StorefrontFooter from "./_components/storefront-footer";
import TopBar from "./_components/topbar";
import MobileBottomBar from "./_components/mobile-bottom-bar";
import CategoryNavContainer from "./_components/category-nav-container";
import { Suspense } from "react";
import CategoryNavSkeleton from "./_components/category-nav-skeleton";
import { cn } from "@/lib/utils";
import { FaTruck, FaClock, FaStore } from "react-icons/fa";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreTopLoader />
      <TopBar />
      <Header />
      <Suspense fallback={<CategoryNavSkeleton />}>
        <CategoryNavContainer />
      </Suspense>

      <div className="w-full bg-white border-b">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex items-center gap-2 py-2 justify-center md:justify-start">
              <FaTruck className="h-5 w-5 text-secondary" />
              <span className="font-medium text-sm">Free delivery</span>
              <span className="text-sm text-gray-600">
                on orders over £75 ex VAT
              </span>
            </div>

            <div className="flex items-center gap-2 py-2 justify-center border-y md:border-y-0 md:border-x border-gray-200">
              <FaClock className="h-5 w-5 text-secondary" />
              <span className="font-medium text-sm">Next day delivery</span>
              <span className="text-sm text-gray-600">7 days per week</span>
            </div>

            <div className="flex items-center gap-2 py-2 justify-center md:justify-end">
              <FaStore className="h-5 w-5 text-secondary" />
              <span className="font-medium text-sm">Click & Collect</span>
              <span className="text-sm text-gray-600">
                in as little as 1 minute
              </span>
            </div>
          </div>
        </div>
      </div>

      {children}
      <MobileBottomBar />
      <StorefrontFooter />
    </>
  );
}
