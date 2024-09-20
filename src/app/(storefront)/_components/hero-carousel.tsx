"use client";

import bannerImage1 from "@/images/banners.jpg";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function HeroCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const content = [
    {
      image: bannerImage1,
    },
    {
      image: bannerImage1,
    },
    // implement here more image as need
  ];

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex">
        {content.map((item, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            <Image src={item.image} alt="bannerImage" />
          </div>
        ))}
      </div>
    </div>
  );
}
