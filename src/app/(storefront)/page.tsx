import Blogs from "./_components/blogs";
import BrandStore from "./_components/brand-store";
import HeroCarousel from "./_components/hero-carousel";
import Features from "./_components/features";
import GiftCard from "./_components/gift-card";
import { getLatestInventoryItems } from "./actions";
import ProductCarousel from "./_components/product-carousel";
import MobileCategoryNav from "./_components/mobile-category-nav";
import { getCategoriesByType } from "./products/actions";
import { CategoryWithChildParent } from "@/types/storefront-products";
import CategoryNav from "./_components/category-nav";
import MobileBottomBar from "./_components/mobile-bottom-bar";

export default async function HomePage() {
  const inventoryItems = await getLatestInventoryItems(20);

  const { categories } = await getCategoriesByType("PRIMARY", "");
  const navCategories = categories as CategoryWithChildParent[];

  return (
    <main className="">
      <CategoryNav categories={navCategories} />
      <HeroCarousel />
      <MobileCategoryNav categories={navCategories} />
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
