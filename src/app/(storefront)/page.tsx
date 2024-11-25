import Blogs from "./_components/blogs";
import BrandStore from "./_components/brand-store";
import HeroCarousel from "./_components/hero-carousel";
import Features from "./_components/features";
import GiftCard from "./_components/gift-card";
import { getLatestInventoryItems } from "./actions";
import ProductCarousel from "./_components/product-carousel";
import MobileCategoryNav from "./_components/mobile-category-nav";

export default async function HomePage() {
  const inventoryItems = await getLatestInventoryItems(20);

  return (
    <main className="">
      <HeroCarousel />
      <MobileCategoryNav />
      <Features />
      <ProductCarousel
        title="Best Selling Products"
        inventoryItems={inventoryItems}
      />
      <BrandStore />
      <ProductCarousel title="New Products" inventoryItems={inventoryItems} />
      <GiftCard />
      <Blogs />
    </main>
  );
}
