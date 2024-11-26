"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./product-card";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  align: "start",
  containScroll: "trimSnaps",
  dragFree: true,
  slidesToScroll: "auto",
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
    <div
      className={cn(
        "container max-w-screen-xl mx-auto my-10",
        "px-4 md:px-6 lg:px-8"
      )}
    >
      <div className="flex justify-between items-center">
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
        <div
          className="overflow-hidden rounded-xl -mx-4 md:-mx-6 lg:-mx-8"
          ref={emblaRef}
        >
          <div className="flex pl-4 md:pl-6 lg:pl-8">
            {inventoryItems.map((inventoryItem) => (
              <div
                key={inventoryItem.id}
                className={cn(
                  "min-w-0 flex-[0_0_100%]", // Force 100% width on smallest screens
                  "sm:flex-[0_0_50%]", // 50% width on small screens
                  "md:flex-[0_0_33.333333%]", // 33.333% width on medium screens
                  "lg:flex-[0_0_25%]", // 25% width on large screens
                  "pr-4 md:pr-6 lg:pr-8 py-5"
                )}
                style={{ maxWidth: "100%" }} // Ensure no overflow
              >
                <ProductCard inventoryItem={inventoryItem} />
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots for mobile and tablet */}
        <div className="flex justify-center gap-1 mt-4 lg:hidden">
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
