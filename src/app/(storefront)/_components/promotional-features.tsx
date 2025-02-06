"use client";

import React from "react";
import { usePathname } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaTruck, FaClock, FaStore } from "react-icons/fa";

const promotionalItems = [
  {
    Icon: FaTruck,
    title: "Free delivery",
    description: "on orders over £75 ex VAT",
  },
  {
    Icon: FaClock,
    title: "Next day delivery",
    description: "7 days per week",
  },
  {
    Icon: FaStore,
    title: "Click & Collect",
    description: "in as little as 1 minute",
  },
];

export default function PromotionalFeatures() {
  const pathname = usePathname();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  // Skip rendering on certain pages
  const excludedRoutes = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/basket",
    "/products/p",
  ];
  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Mobile/Tablet Slider */}
      <div className="lg:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {promotionalItems.map((item, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className="flex items-center justify-center gap-2 py-2.5 px-4">
                  <item.Icon className="h-5 w-5 text-secondary" />
                  <span className="font-medium text-sm text-gray-900">
                    {item.title}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:block container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-3">
          {promotionalItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 py-2 ${
                index === 1
                  ? "justify-center border-x border-gray-200"
                  : index === 0
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <item.Icon className="h-5 w-5 text-secondary" />
              <span className="font-medium text-sm text-gray-900">
                {item.title}
              </span>
              <span className="text-sm text-gray-600">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
