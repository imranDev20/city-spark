import IdealAdlantic30CombiFlue from "@/images/advertisements/ideal-atlantic-30-combi-flue.jpg";
import VaillantEcoFitPlus832Combi from "@/images/advertisements/vaillant-ecofit-plus-832-combi.jpg";

import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdvertisementTwoColumn() {
  return (
    <section
      className={cn(
        "container max-w-screen-xl mx-auto my-12",
        "px-4 md:px-6 lg:px-8",
        "grid grid-cols-2 gap-5"
      )}
    >
      <div className="lg:col-span-1 relative">
        <Image
          src={VaillantEcoFitPlus832Combi}
          alt="Ideal Atlantic"
          width={600}
          height={400}
          className="rounded-lg h-full"
        />
      </div>
      <div className="lg:col-span-1 relative">
        <Image
          src={IdealAdlantic30CombiFlue}
          alt="Ideal Atlantic"
          width={600}
          height={400}
          className="rounded-lg h-full"
        />
      </div>
    </section>
  );
}
