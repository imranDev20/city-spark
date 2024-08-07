import BestSellingProductsCard from "./_components/best-selling-products-card";
import Blogs from "./_components/blogs";
import BrandStore from "./_components/brand-store";
import CategoriesIcons from "./_components/categories-icons";
import EmblaCarousel from "./_components/embla-carousel";
import Features from "./_components/features";
import GiftCard from "./_components/gift-card";
import NewProducts from "./_components/new-products";

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <CategoriesIcons />
        <EmblaCarousel />
        <Features />
        <BestSellingProductsCard />
        <BrandStore />
        <NewProducts />
        <GiftCard />
        <Blogs />
      </main>
    </div>
  );
}
