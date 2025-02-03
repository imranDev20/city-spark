import AdvertisementWideOne from "./_components/advertisement-wide-one";
import HeroCarousel from "./_components/hero-carousel";
import AdvertisementWideTwo from "./_components/advertisement-wide-two";
import AdvertisementTwoColumn from "./_components/advertisement-two-column";
import ProductCarouselContainer from "./_components/product-carousel-container";
import MobileCategoryNavContainer from "./_components/mobile-category-nav-container";
import { Suspense } from "react";
import MobileCategoryNavSkeleton from "./_components/homepage/mobile-category-nav-skeleton";
import ProductCarouselSkeleton from "./_components/homepage/product-carousel-skeleton";
import PromotionalGrid from "./_components/homepage/promotional-grid";
import ConstructionDialog from "./_components/homepage/construction-dialog";
import ConstructionAlert from "./_components/homepage/construction-alert";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />

      <ConstructionAlert />
      <Suspense fallback={<MobileCategoryNavSkeleton />}>
        <MobileCategoryNavContainer />
      </Suspense>

      <PromotionalGrid />

      <ConstructionDialog />
    </main>
  );
}
