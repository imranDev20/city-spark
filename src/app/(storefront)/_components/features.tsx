import Image from "next/image";
import MainCombi25KWFlue from "@/images/advertisements/main-combi-25kw-flue.jpg";
import MainCombi30KWFlue from "@/images/advertisements/main-combi-30kw-flue.jpg";
import MainEcoCompact25KWNaturalGas from "@/images/advertisements/main-eco-compact-25kw-natural-gas.jpg";
import MainEcoCompact30KWGasCombination from "@/images/advertisements/main-eco-compact-30kw-gas-combination.jpg";
import VaillantEcoTechPro826Flue from "@/images/advertisements/vaillant-eco-tech-pro-826-26kw-flue.jpg";

export default function PromotionalGrid() {
  return (
    <div className="mt-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        <div>
          <Image
            src={MainCombi25KWFlue}
            alt="Promotion 1"
            width={800}
            height={400}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 0"
            loading="lazy"
          />
        </div>
        <div>
          <Image
            src={MainCombi30KWFlue}
            alt="Promotion 2"
            width={400}
            height={200}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 0"
            loading="lazy"
          />
        </div>
        <div>
          <Image
            src={MainEcoCompact25KWNaturalGas}
            alt="Promotion 3"
            width={400}
            height={200}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 0"
            loading="lazy"
          />
        </div>
        <div>
          <Image
            src={MainEcoCompact30KWGasCombination}
            alt="Promotion 4"
            width={400}
            height={200}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 0"
            loading="lazy"
          />
        </div>
        <div>
          <Image
            src={VaillantEcoTechPro826Flue}
            alt="Promotion 5"
            width={800}
            height={200}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 0"
            loading="lazy"
          />
        </div>
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden lg:grid grid-cols-3 gap-4"
        style={{ gridTemplateRows: "repeat(3, minmax(180px, 1fr))" }}
      >
        <div className="col-span-2 row-span-2 relative">
          <Image
            src={MainCombi25KWFlue}
            alt="Main promotion"
            width={1000}
            height={600}
            className="rounded-lg h-full"
            placeholder="blur"
            sizes="(min-width: 1024px) 66vw, 0"
            loading="lazy"
          />
        </div>
        <div className="relative">
          <Image
            src={MainCombi30KWFlue}
            alt="Secondary promotion 1"
            width={500}
            height={300}
            className="rounded-lg h-full"
            placeholder="blur"
            sizes="(min-width: 1024px) 33vw, 0"
            loading="lazy"
          />
        </div>
        <div className="relative">
          <Image
            src={MainEcoCompact25KWNaturalGas}
            alt="Secondary promotion 2"
            width={500}
            height={300}
            className="rounded-lg h-full"
            placeholder="blur"
            sizes="(min-width: 1024px) 33vw, 0"
            loading="lazy"
          />
        </div>
        <div className="relative">
          <Image
            src={MainEcoCompact30KWGasCombination}
            alt="Secondary promotion 3"
            fill
            className="object-cover rounded-lg h-full"
            placeholder="blur"
            sizes="(min-width: 1024px) 33vw, 0"
            loading="lazy"
          />
        </div>
        <div className="col-span-2 relative">
          <Image
            src={VaillantEcoTechPro826Flue}
            alt="Bottom promotion"
            width={1000}
            height={200}
            className="rounded-lg h-full"
            placeholder="blur"
            sizes="(min-width: 1024px) 66vw, 0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
