import Image from "next/image";
import MainCombi25KWFlue from "@/images/advertisements/main-combi-25kw-flue.jpg";
import MainCombi30KWFlue from "@/images/advertisements/main-combi-30kw-flue.jpg";
import MainEcoCompact25KWNaturalGas from "@/images/advertisements/main-eco-compact-25kw-natural-gas.jpg";
import MainEcoCompact30KWGasCombination from "@/images/advertisements/main-eco-compact-30kw-gas-combination.jpg";
import VaillantEcoTechPro826Flue from "@/images/advertisements/vaillant-eco-tech-pro-826-26kw-flue.jpg";
import Link from "next/link";

export default function PromotionalGrid() {
  return (
    <div className="mt-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {/* First image - prioritized since it's above the fold */}
        <Image
          src={MainCombi25KWFlue}
          alt="Main Combi 25KW Flue Boiler"
          width={800}
          height={400}
          className="w-full rounded-lg"
          placeholder="blur"
          sizes="92vw"
          priority
          quality={60}
        />

        {/* Other images with lazy loading */}
        <Image
          src={MainCombi30KWFlue}
          alt="Main Combi 30KW Flue Boiler"
          width={800}
          height={400}
          className="w-full rounded-lg"
          placeholder="blur"
          sizes="92vw"
          priority
          quality={50}
        />
        <Image
          src={MainEcoCompact25KWNaturalGas}
          alt="Main Eco Compact 25KW Natural Gas Boiler"
          width={800}
          height={400}
          className="w-full rounded-lg"
          placeholder="blur"
          sizes="92vw"
          quality={50}
        />
        <Image
          src={MainEcoCompact30KWGasCombination}
          alt="Main Eco Compact 30KW Gas Combination Boiler"
          width={800}
          height={400}
          className="w-full rounded-lg"
          placeholder="blur"
          sizes="92vw"
          loading="lazy"
          quality={50}
        />
        <Image
          src={VaillantEcoTechPro826Flue}
          alt="Vaillant Eco Tech Pro 826 Flue"
          width={800}
          height={400}
          className="w-full rounded-lg"
          placeholder="blur"
          sizes="92vw"
          loading="lazy"
          quality={50}
        />
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden lg:grid grid-cols-3 gap-4"
        style={{ gridTemplateRows: "repeat(3, minmax(180px, 1fr))" }}
      >
        {/* Main large image */}
        <div className="col-span-2 row-span-2">
          <Image
            src={MainCombi25KWFlue}
            alt="Main Combi 25KW Flue Boiler"
            width={1000}
            height={600}
            className="rounded-lg h-full w-full object-cover"
            placeholder="blur"
            sizes="66vw"
            priority
            quality={60}
          />
        </div>

        {/* Secondary images */}
        <div>
          <Link href="/products/p/main-eco-compact-30kw-natural-gas-combination-boiler-erp/p/cm49j07ox001mjf032ej7j82s">
            <Image
              src={MainCombi30KWFlue}
              alt="Main Combi 30KW Flue Boiler"
              width={500}
              height={300}
              className="rounded-lg h-full w-full object-cover"
              placeholder="blur"
              sizes="33vw"
              priority
              quality={50}
            />
          </Link>
        </div>
        <div>
          <Link href="/products/p/main-eco-compact-25kw-natural-gas-combination-boiler-erp/p/cm49i340f0012jf036q5tu8n2">
            <Image
              src={MainEcoCompact25KWNaturalGas}
              alt="Main Eco Compact 25KW Natural Gas Boiler"
              width={500}
              height={300}
              className="rounded-lg h-full w-full object-cover"
              placeholder="blur"
              sizes="33vw"
              priority
              quality={50}
            />
          </Link>
        </div>
        <div>
          <Image
            src={MainEcoCompact30KWGasCombination}
            alt="Main Eco Compact 30KW Gas Combination Boiler"
            width={500}
            height={300}
            className="rounded-lg h-full w-full object-cover"
            placeholder="blur"
            sizes="33vw"
            loading="lazy"
            quality={50}
          />
        </div>
        <div className="col-span-2">
          <Image
            src={VaillantEcoTechPro826Flue}
            alt="Vaillant Eco Tech Pro 826 Flue"
            width={1000}
            height={300}
            className="rounded-lg h-full w-full object-cover"
            placeholder="blur"
            sizes="66vw"
            loading="lazy"
            quality={50}
          />
        </div>
      </div>
    </div>
  );
}
