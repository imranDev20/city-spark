import Header from "./_components/header";
import StorefrontFooter from "./_components/storefront-footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <StorefrontFooter />
    </>
  );
}
