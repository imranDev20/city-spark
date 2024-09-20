import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import CategoryNav from "./_components/category-nav";
import Header from "./_components/header";
import StoreTopLoader from "./_components/store-top-loader";
import StorefrontFooter from "./_components/storefront-footer";
import TopBar from "./_components/topbar";

// Create a simple loading component for the Header
function HeaderSkeleton() {
  return <div className="w-full h-16 bg-primary animate-pulse"></div>;
}

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
      <CategoryNav />
      <Separator />
      {children}
      <StorefrontFooter />
    </>
  );
}
