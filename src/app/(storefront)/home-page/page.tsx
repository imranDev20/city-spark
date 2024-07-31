import BestSellingProductsCard from "./_components/best-selling-products-card";
import Blogs from "./_components/blogs";
import BrandStore from "./_components/brand-store";
import CategoriesIcons from "./_components/categories-icons";
import EmblaCarousel from "./_components/embla-carousel";
import Features from "./_components/features";
import GiftCard from "./_components/gift-card";
import NewProducts from "./_components/new-products";

export default function HomePageUI() {
  return (
    <div>
      <CategoriesIcons />
      <EmblaCarousel />
      <Features />
      <BestSellingProductsCard />
      <BrandStore />
      <NewProducts />
      <GiftCard />
      <Blogs />
      {/* <ContactUs /> */}
    </div>
  );
}
