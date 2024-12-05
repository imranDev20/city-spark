import Image from "next/image";
import MainCombi25KWFlue from "@/images/advertisements/main-combi-25kw-flue.jpg";
import MainCombi30KWFlue from "@/images/advertisements/main-combi-30kw-flue.jpg";
import MainEcoCompact25KWNaturalGas from "@/images/advertisements/main-eco-compact-25kw-natural-gas.jpg";
import MainEcoCompact30KWGasCombination from "@/images/advertisements/main-eco-compact-30kw-gas-combination.jpg";
import VaillantEcoTechPro826Flue from "@/images/advertisements/vaillant-eco-tech-pro-826-26kw-flue.jpg";
import Link from "next/link";

export default function PromotionalGrid() {
  return (
    <section
      className="mt-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
      aria-label="Featured Boiler Products"
    >
      {/* Mobile View */}
      <div
        className="lg:hidden space-y-4"
        role="region"
        aria-label="Mobile Product Gallery"
      >
        {/* First image - prioritized since it's above the fold */}
        <div role="img" aria-label="Featured Main Combi 25KW Boiler">
          <Image
            src={MainCombi25KWFlue}
            alt="Main Combi 25KW Flue Boiler - Energy efficient combination boiler with advanced heating system"
            width={800}
            height={400}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="92vw"
            priority
            quality={60}
          />
        </div>

        {/* Other images with lazy loading */}
        <div role="img" aria-label="Main Combi 30KW Boiler Display">
          <Image
            src={MainCombi30KWFlue}
            alt="Main Combi 30KW Flue Boiler - High-performance heating solution for larger homes"
            width={800}
            height={400}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="92vw"
            priority
            quality={50}
          />
        </div>
        <div role="img" aria-label="Main Eco Compact 25KW Boiler Display">
          <Image
            src={MainEcoCompact25KWNaturalGas}
            alt="Main Eco Compact 25KW Natural Gas Boiler - Compact and efficient natural gas heating system"
            width={800}
            height={400}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="92vw"
            quality={50}
          />
        </div>
        <div
          role="img"
          aria-label="Main Eco Compact 30KW Combination Boiler Display"
        >
          <Image
            src={MainEcoCompact30KWGasCombination}
            alt="Main Eco Compact 30KW Gas Combination Boiler - Premium combination heating system"
            width={800}
            height={400}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="92vw"
            loading="lazy"
            quality={50}
          />
        </div>
        <div role="img" aria-label="Vaillant Eco Tech Pro Boiler Display">
          <Image
            src={VaillantEcoTechPro826Flue}
            alt="Vaillant Eco Tech Pro 826 Flue - Professional grade eco-friendly heating solution"
            width={800}
            height={400}
            className="w-full rounded-lg"
            placeholder="blur"
            sizes="92vw"
            loading="lazy"
            quality={50}
          />
        </div>
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden lg:grid grid-cols-3 gap-4"
        style={{ gridTemplateRows: "repeat(3, minmax(180px, 1fr))" }}
        role="region"
        aria-label="Desktop Product Gallery"
      >
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2"
          role="img"
          aria-label="Featured Main Combi 25KW Boiler"
        >
          <Image
            src={MainCombi25KWFlue}
            alt="Main Combi 25KW Flue Boiler - Energy efficient combination boiler with advanced heating system"
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
        <div role="img" aria-label="Main Combi 30KW Boiler with Product Link">
          <Link
            href="/products/p/main-eco-compact-30kw-natural-gas-combination-boiler-erp/p/cm49j07ox001mjf032ej7j82s"
            aria-label="View Main Combi 30KW Flue Boiler details"
          >
            <Image
              src={MainCombi30KWFlue}
              alt="Main Combi 30KW Flue Boiler - High-performance heating solution for larger homes"
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
        <div
          role="img"
          aria-label="Main Eco Compact 25KW Boiler with Product Link"
        >
          <Link
            href="/products/p/main-eco-compact-25kw-natural-gas-combination-boiler-erp/p/cm49i340f0012jf036q5tu8n2"
            aria-label="View Main Eco Compact 25KW Natural Gas Boiler details"
          >
            <Image
              src={MainEcoCompact25KWNaturalGas}
              alt="Main Eco Compact 25KW Natural Gas Boiler - Compact and efficient natural gas heating system"
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
        <div
          role="img"
          aria-label="Main Eco Compact 30KW Combination Boiler Display"
        >
          <Image
            src={MainEcoCompact30KWGasCombination}
            alt="Main Eco Compact 30KW Gas Combination Boiler - Premium combination heating system"
            width={500}
            height={300}
            className="rounded-lg h-full w-full object-cover"
            placeholder="blur"
            sizes="33vw"
            loading="lazy"
            quality={50}
          />
        </div>
        <div
          className="col-span-2"
          role="img"
          aria-label="Vaillant Eco Tech Pro Boiler Display"
        >
          <Image
            src={VaillantEcoTechPro826Flue}
            alt="Vaillant Eco Tech Pro 826 Flue - Professional grade eco-friendly heating solution"
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
    </section>
  );
}
