"use client";

import VaillantEcoFitPlus832Combi from "@/images/advertisements/vaillant-ecofit-plus-832-combi.jpg";
import IdealAtlantic30CombiFlue from "@/images/advertisements/ideal-atlantic-30-combi-flue.jpg";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const CarouselContent = ({
  content,
  className,
  showNavButtons = false,
  isDesktop = false,
}: {
  content: { image: any }[];
  className?: string;
  showNavButtons?: boolean;
  isDesktop?: boolean;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative group", className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {content.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex-[0_0_100%] min-w-0 relative",
                isDesktop && "flex justify-center items-center px-4"
              )}
            >
              <div
                className={cn(
                  "relative",
                  isDesktop && "max-w-screen-xl w-full"
                )}
              >
                <Image
                  src={item.image}
                  alt={`Banner ${index + 1}`}
                  className={cn("w-full h-auto", isDesktop && "object-contain")}
                  style={{
                    objectFit: "contain",
                  }}
                  priority={index === 0}
                  sizes={
                    isDesktop ? "(max-width: 1280px) 100vw, 1280px" : "100vw"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNavButtons && (
        <>
          <button
            onClick={scrollPrev}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2",
              "bg-white/80 hover:bg-white rounded-full p-2",
              "transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              "shadow-lg hover:shadow-xl"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              "bg-white/80 hover:bg-white rounded-full p-2",
              "transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              "shadow-lg hover:shadow-xl"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {content.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              "hover:bg-white/80",
              selectedIndex === index ? "bg-white scale-110" : "bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function HeroCarousel() {
  const desktopContent = [
    { image: VaillantEcoFitPlus832Combi },
    { image: IdealAtlantic30CombiFlue },
  ];

  const mobileContent = [
    { image: VaillantEcoFitPlus832Combi },
    { image: IdealAtlantic30CombiFlue },
  ];

  return (
    <section className="bg-primary w-full">
      <CarouselContent
        content={desktopContent}
        className="hidden lg:block py-4"
        showNavButtons={true}
        isDesktop={true}
      />
      <CarouselContent content={mobileContent} className="lg:hidden mt-5" />
    </section>
  );
}
