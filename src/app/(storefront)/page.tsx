import Blogs from "./_components/blogs";
import BrandStore from "./_components/brand-store";
import HeroCarousel from "./_components/hero-carousel";
import Features from "./_components/features";
import GiftCard from "./_components/gift-card";
import { getLatestInventoryItems } from "./actions";
import ProductCarousel from "./_components/product-carousel";

export default async function HomePage() {
  const inventoryItems = await getLatestInventoryItems(20);

  return (
    <main className="">
      <HeroCarousel />
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
