import AdvertisementWideOne from "./_components/advertisement-wide-one";
import HeroCarousel from "./_components/hero-carousel";
import Features from "./_components/features";
import AdvertisementWideTwo from "./_components/advertisement-wide-two";
import AdvertisementTwoColumn from "./_components/advertisement-two-column";
import ProductCarouselContainer from "./_components/product-carousel-container";
import MobileCategoryNavContainer from "./_components/mobile-category-nav-container";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <Suspense fallback="Loading...">
        <MobileCategoryNavContainer />
      </Suspense>
      <Features />

      <Suspense fallback="Loading...">
        <ProductCarouselContainer title="Best Selling Products" />
      </Suspense>
      <AdvertisementWideOne />

      <Suspense fallback="Loading...">
        <ProductCarouselContainer title="New Products" />
      </Suspense>
      <AdvertisementTwoColumn />
      <AdvertisementWideTwo />
    </main>
  );
}
