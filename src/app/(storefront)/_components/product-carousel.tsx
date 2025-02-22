"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProductCard from "./product-card";
import type { InventoryItemWithRelations } from "@/services/inventory";

interface ProductCarouselProps {
  inventoryItems: InventoryItemWithRelations[];
  title: string;
}

export default function ProductCarousel({
  inventoryItems,
  title,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
    containScroll: "keepSnaps",
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 4 },
      "(min-width: 768px)": { slidesToScroll: 3 },
      "(min-width: 640px)": { slidesToScroll: 2 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="container max-w-screen-xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous products</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next products</span>
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden -mx-4">
        <div className="px-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {inventoryItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex-none pl-4",
                    "w-full",
                    "sm:w-1/2",
                    "md:w-1/3",
                    "lg:w-1/4"
                  )}
                >
                  <div className="py-6 px-0.5">
                    <ProductCard inventoryItem={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Indicators */}
      <div className="flex justify-center gap-1 mt-4 lg:hidden">
        {scrollSnaps.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
