"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./product-card";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";

type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
      };
    };
  };
}>;

interface ProductCarouselProps {
  inventoryItems: InventoryWithRelations[];
  title: string;
}

const OPTIONS: EmblaOptionsType = {
  loop: false,
  slidesToScroll: 1,
  align: "start",
  containScroll: "trimSnaps",
  breakpoints: {
    "(max-width: 640px)": { slidesToScroll: 1 },
    "(min-width: 641px)": { slidesToScroll: 2 },
    "(min-width: 1024px)": { slidesToScroll: 4 },
  },
};

export default function ProductCarousel({
  inventoryItems,
  title,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="container max-w-screen-xl mx-auto my-10">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="font-semibold text-xl sm:text-2xl">{title}</h2>

        <div className="flex gap-2">
          <Button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full transition-all hover:scale-105"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full transition-all hover:scale-105"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex -mx-2">
            {inventoryItems.map((inventoryItem) => (
              <div
                key={inventoryItem.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333333%] lg:flex-[0_0_25%] px-2 py-5"
              >
                <ProductCard inventoryItem={inventoryItem} />
              </div>
            ))}
          </div>
        </div>

        {/* Optional: Progress dots for mobile */}
        <div className="flex justify-center gap-1 mt-4 md:hidden">
          {scrollSnaps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === selectedIndex ? "w-6 bg-primary" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
