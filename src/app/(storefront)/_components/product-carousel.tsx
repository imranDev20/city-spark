"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./product-card";
import { Prisma } from "@prisma/client";

type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
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

export default function ProductCarousel({
  inventoryItems,
  title,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="container max-w-screen-xl mx-auto my-10">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="font-semibold text-xl sm:text-2xl">{title}</h2>

        <div className="flex gap-3 text-gray-400">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={`border-gray-400 p-0.5 border rounded-full h-7 w-7 inline-flex justify-center items-center ${
              prevBtnDisabled ? "text-gray-400" : "text-black"
            } transition-colors duration-200`}
          >
            <ArrowLeftIcon />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={`border-gray-400 p-0.5 border rounded-full h-7 w-7 inline-flex justify-center items-center ${
              nextBtnDisabled ? "text-gray-400" : "text-black"
            } transition-colors duration-200`}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-2">
          {inventoryItems.map((inventoryItem) => (
            <div
              key={inventoryItem.id}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333333%] lg:flex-[0_0_25%] px-2"
            >
              <ProductCard inventoryItem={inventoryItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
