"use client";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import Image from "next/image";
import img from "../../../../images/dummy-img.png";
import "./carousel.css";
export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const content = [
    {
      title: "One Time Buy Offer",
      description: "Dewalt Pack  Tools Organizer",
      price: "320",
      image:
        "https://cdn.pixabay.com/photo/2017/08/06/00/02/court-2586882_1280.jpg",
    },
    {
      title: "One Time Buy Offer",
      description: "Dewalt Pack Tools Organizer",
      price: "270",
      image:
        "https://cdn.pixabay.com/photo/2017/08/06/00/02/court-2586882_1280.jpg",
    },
    {
      title: "One Time Buy Offer",
      description: "Dewalt Pack Tools Organizer",
      price: "350",
      image:
        "https://cdn.pixabay.com/photo/2017/08/06/00/02/court-2586882_1280.jpg",
    },
  ];

  return (
    <div className="embla bg-primary     h-[420px] mx-auto" ref={emblaRef}>
      <div className="embla__container">
        {content.map((item, index) => (
          <div key={index} className="embla__slide ">
            <div className="w-full flex relative py-20 pl-28  ">
              <div className="text-white space-y-2  w-1/2  ">
                <h2 className="text-2xl  ">{item.title}</h2>
                <p className="text-5xl font-extrabold  ">{item.description}</p>
                <p className="text-2xl text-black line-through">£310.99</p>
                <p className="text-4xl font-bold text-yellow-400">
                  £{item.price}
                </p>
                <button className="mt-4 px-6 py-2 bg-black text-white rounded-sm">
                  SHOP NOW
                </button>
              </div>

              <div className="w-1/2">
                <Image
                  src={img}
                  alt="productIamge"
                  className=" h-80   w-60  "
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
