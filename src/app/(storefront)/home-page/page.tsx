import BestSellingProductsCard from "./_components/best-selling-products-card";
import EmblaCarousel from "./_components/embla-carousel";
import Features from "./_components/features";

export default function HomePageUI() {
  return (
    <div className="w-[1280px] mx-auto">
      <EmblaCarousel />
      <BestSellingProductsCard />
      <Features />
    </div>
  );
}
