import Header from "./_components/header";
import StoreTopLoader from "./_components/store-top-loader";
import StorefrontFooter from "./_components/storefront-footer";
import TopBar from "./_components/topbar";
import MobileBottomBar from "./_components/mobile-bottom-bar";
import CategoryNavContainer from "./_components/category-nav-container";
import { Suspense } from "react";
import CategoryNavSkeleton from "./_components/category-nav-skeleton";
import PromotionalFeatures from "./_components/promotional-features";
import HeaderFallback from "./_components/header-fallback";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreTopLoader />
      <TopBar />

      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>

      <Suspense fallback={<CategoryNavSkeleton />}>
        <CategoryNavContainer />
      </Suspense>

      <PromotionalFeatures />

      {children}
      <MobileBottomBar />
      <StorefrontFooter />
    </>
  );
}
