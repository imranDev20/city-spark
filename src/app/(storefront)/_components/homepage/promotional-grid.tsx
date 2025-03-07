import Image from "next/image";
import Link from "next/link";
import AristonPro1Eco from "@/images/advertisements-new/ariston-pro1-eco.jpg";
import AdeyMagnaClean from "@/images/advertisements-new/adey-magna-clean.jpg";
import AristonVelisEvo from "@/images/advertisements-new/ariston-velis-evo.jpg";
import AristonVelisEvoWifi from "@/images/advertisements-new/ariston-velis-evo-wifi.jpg";
import HoneywellLyric from "@/images/advertisements-new/honeywell-lyric.jpg";
import HoneywellT3R from "@/images/advertisements-new/honeywell-t3r.jpg";
import HoneywellT6R from "@/images/advertisements-new/honeywell-t6r.jpg";
import AdeyMc3Cleaner from "@/images/advertisements-new/adey-mc3-cleaner.jpg";
import AdeyMc1Protector from "@/images/advertisements-new/adey-mc1-protector.jpg";
import SentinelEliminatorVortex700 from "@/images/advertisements-new/sentinel-eliminator-vortex-700.jpg";
import SentinelEliminatorVortex from "@/images/advertisements-new/sentinel-eliminator-vortex.jpg";
import SentinelLeakSealer from "@/images/advertisements-new/sentinel-leak-sealer.jpg";

import ZoneValveGreatPrices from "@/images/advertisements-new/zone-valve-great-prices.jpg";
import WorldLeadingGrundfos from "@/images/advertisements-new/world-leading-grundfos.jpg";
import ActuatorHeads from "@/images/advertisements-new/actuator-heads.jpg";

export default function PromotionalGrid() {
  const firstRowImages = [
    {
      src: AristonPro1Eco,
      alt: "Ariston Pro1 Eco Boiler",
      link: "https://www.citysparke3.co.uk/products?search=ariston%20pro1%20eco",
    },
    {
      src: AdeyMagnaClean,
      alt: "Adey MagnaClean Magnetic Filter",
      link: "https://citysparke3.co.uk/products/p/Magn%E2%80%8BaClean%20AtomSC%E2%84%A2%20%7C%20Compact%20Compliance%20(FL1-03-06485)/p/cm6wbxzt8005dl203p731hq9r",
    },
    {
      src: AristonVelisEvo,
      alt: "Ariston Velis Evo Water Heater",
      link: "https://citysparke3.co.uk/products?search=ariston%20velis%20evo",
    },
    {
      src: AristonVelisEvoWifi,
      alt: "Ariston Velis Evo Wifi Water Heater",
      link: "https://citysparke3.co.uk/products?search=ariston%20velis%20evo",
    },
  ];

  const secondRowImages = [
    {
      src: WorldLeadingGrundfos,
      alt: "World Leading Grundfos Pumps",
      link: "https://citysparke3.co.uk/products?search=grundfos%20pump",
    },
    {
      src: ZoneValveGreatPrices,
      alt: "Zone Valve Great Prices",
      link: "https://citysparke3.co.uk/products?search=zone%20valve",
    },
    {
      src: ActuatorHeads,
      alt: "Actuator Heads",
      link: "https://citysparke3.co.uk/products?search=actuator",
    },
  ];

  const fifthRowImages = [
    {
      src: HoneywellLyric,
      alt: "Honeywell Lyric Smart Thermostat",
      link: "https://citysparke3.co.uk/products?search=honeywell%20lyric",
    },
    {
      src: HoneywellT3R,
      alt: "Honeywell T3R Wireless Thermostat",
      link: "https://citysparke3.co.uk/products?search=honeywell%20t3r",
    },
    {
      src: AdeyMc3Cleaner,
      alt: "Adey MC3 Cleaner Chemical Treatment",
      link: "https://citysparke3.co.uk/products?search=adey%20mc3",
    },
    {
      src: AdeyMc1Protector,
      alt: "Adey MC1 Central Heating Protector",
      link: "https://citysparke3.co.uk/products?search=adey%20mc1",
    },
  ];

  const seventhRowImages = [
    {
      src: SentinelEliminatorVortex700,
      alt: "Sentinel Eliminator Vortex 700 Filter",
      link: "https://www.citysparke3.co.uk/products/p/Sentinel%20Eliminator%20Vortex%20250%2022mm/p/cm4icv3n3001elg03thp5qzfx",
    },
    {
      src: SentinelEliminatorVortex,
      alt: "Sentinel Eliminator Vortex Filter",
      link: "https://citysparke3.co.uk/products?search=sentinel%20eliminator%20vortex",
    },
    {
      src: SentinelLeakSealer,
      alt: "Sentinel Leak Sealer Solution",
      link: "https://citysparke3.co.uk/products?search=sentinel%20leak%20sealer",
    },
    {
      src: HoneywellT6R,
      alt: "Honeywell T6R Wireless Thermostat",
      link: "https://citysparke3.co.uk/products?search=honeywell%20t6r",
    },
  ];

  return (
    <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* First row - 4 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {firstRowImages.map((image, index) => (
          <div
            key={index}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <Link href={image.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={image.src}
                alt={image.alt}
                width={420}
                height={700}
                className="object-contain h-full rounded-lg overflow-hidden"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Second row - 3 images */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {secondRowImages.map((image, index) => (
          <div
            key={index}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <Link
              href={image.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={700}
                height={400}
                className="object-contain h-full rounded-lg overflow-hidden"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Third row - 2 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="aspect-[6/3] bg-gray-100 rounded-lg"></div>
        <div className="aspect-[6/3] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Fourth row - 1 wide banner */}
      <div className="mt-8">
        <div className="aspect-[21/3] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Fifth row - 4 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {fifthRowImages.map((image, index) => (
          <div
            key={index}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <Link
              href={image.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={700}
                height={420}
                className="object-contain h-full rounded-lg overflow-hidden"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Sixth row - 1 wide banner */}
      <div className="mt-8">
        <div className="aspect-[21/3] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Seventh row - 4 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {seventhRowImages.map((image, index) => (
          <div
            key={index}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <Link
              href={image.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={700}
                height={420}
                className="object-contain h-full rounded-lg overflow-hidden"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
