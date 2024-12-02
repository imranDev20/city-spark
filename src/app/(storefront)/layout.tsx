import Header from "./_components/header";
import StoreTopLoader from "./_components/store-top-loader";
import StorefrontFooter from "./_components/storefront-footer";
import TopBar from "./_components/topbar";
import MobileBottomBar from "./_components/mobile-bottom-bar";
import CategoryNavContainer from "./_components/category-nav-container";

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
      <CategoryNavContainer />
      {children}
      <MobileBottomBar />
      <StorefrontFooter />
    </>
  );
}
