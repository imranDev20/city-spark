import AdvertisementWideOne from "./_components/advertisement-wide-one";
import HeroCarousel from "./_components/hero-carousel";
import Features from "./_components/features";
import AdvertisementWideTwo from "./_components/advertisement-wide-two";
import { getLatestInventoryItems } from "./actions";
import ProductCarousel from "./_components/product-carousel";
import MobileCategoryNav from "./_components/mobile-category-nav";
import { getCategoriesByType } from "./products/actions";
import { CategoryWithChildParent } from "@/types/storefront-products";
import AdvertisementTwoColumn from "./_components/advertisement-two-column";

export default async function HomePage() {
  const inventoryItems = await getLatestInventoryItems(20);

  const { categories } = await getCategoriesByType("PRIMARY", "");
  const navCategories = categories as CategoryWithChildParent[];

  return (
    <main className="">
      <HeroCarousel />
      <MobileCategoryNav categories={navCategories} />
      <Features />
      <ProductCarousel
        title="Best Selling Products"
        inventoryItems={inventoryItems}
      />
      <AdvertisementWideOne />
      <ProductCarousel title="New Products" inventoryItems={inventoryItems} />

      <AdvertisementWideTwo />
      <AdvertisementTwoColumn />
    </main>
  );
}
