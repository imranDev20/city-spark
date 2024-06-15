import Header from "./_components/header";
import Footer from "./_components/footer";
import { StorefrontFooter } from "./_components/storefront-footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        Carousel <br />
        features with 3 colums <br />
        deals <br />
        categories <br />
      </main>
      <StorefrontFooter />
    </div>
  );
}
