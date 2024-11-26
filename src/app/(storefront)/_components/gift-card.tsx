"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GiftCard() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* First Card */}
        <div className="bg-primary rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white uppercase mb-4 leading-tight">
                Lorem ipsum dolor sit amet
              </h2>
              <Button className="bg-white hover:bg-white/90 text-black font-bold w-fit px-6 py-2">
                SEE OFFER
              </Button>
            </div>
            <div className="w-full sm:w-2/5 relative min-h-[200px] sm:min-h-0">
              <Image
                src="/api/placeholder/400/320"
                alt="Promotional offer"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="bg-primary rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white uppercase mb-4 leading-tight">
                Lorem ipsum dolor sit amet
              </h2>
              <Button className="bg-white hover:bg-white/90 text-black font-bold w-fit px-6 py-2">
                GIFT CARD
              </Button>
            </div>
            <div className="w-full sm:w-2/5 relative min-h-[200px] sm:min-h-0">
              <Image
                src="/api/placeholder/400/320"
                alt="Gift card"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
