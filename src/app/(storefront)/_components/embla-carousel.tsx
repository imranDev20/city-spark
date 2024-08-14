"use client";
import bannerImage1 from "@/images/banners.jpg";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import "./carousel.css";

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const content = [
    {
      image: bannerImage1,
    },

    // implement here more image as need
  ];

  return (
    <div ref={emblaRef}>
      <div className="embla__container">
        {content.map((item, index) => (
          <div key={index} className="embla__slide ">
            <Image src={item.image} alt="bannerImage" />
          </div>
        ))}
      </div>
    </div>
  );
}
