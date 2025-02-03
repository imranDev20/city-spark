import Image from "next/image";
import AristonPro1Eco from "@/images/advertisements/ariston-pro1-eco.jpg";
import AdeyMagnaClean from "@/images/advertisements/adey-magna-clean.jpg";
import AristonVelisEvo from "@/images/advertisements/ariston-velis-evo.jpg";
import AristonVelisEvoWifi from "@/images/advertisements/ariston-velis-evo-wifi.jpg";
import HoneywellLyric from "@/images/advertisements/honeywell-lyric.jpg";
import HoneywellT3R from "@/images/advertisements/honeywell-t3r.jpg";
import AdeyMcProtector from "@/images/advertisements/adey-mc-protector.jpg";
import AdeyMc1Cleaner from "@/images/advertisements/adey-mc1-cleaner.jpg";
import SentinelEliminatorVortex700 from "@/images/advertisements/sentinel-eliminator-vortex-700.jpg";
import SentinelEliminatorVortex from "@/images/advertisements/sentinel-eliminator-vortex.jpg";
import SentinelLeakSealer from "@/images/advertisements/sentinel-leak-sealer.jpg";

export default function PromotionalGrid() {
  const firstRowImages = [
    { src: AristonPro1Eco, alt: "Ariston Pro1 Eco Boiler" },
    { src: AdeyMagnaClean, alt: "Adey MagnaClean Magnetic Filter" },
    { src: AristonVelisEvo, alt: "Ariston Velis Evo Water Heater" },
    { src: AristonVelisEvoWifi, alt: "Ariston Velis Evo Wifi Water Heater" },
  ];

  const fifthRowImages = [
    { src: HoneywellLyric, alt: "Honeywell Lyric Smart Thermostat" },
    { src: HoneywellT3R, alt: "Honeywell T3R Wireless Thermostat" },
    { src: AdeyMcProtector, alt: "Adey MC Protector Chemical Treatment" },
    { src: AdeyMc1Cleaner, alt: "Adey MC1 Central Heating Cleaner" },
  ];

  const seventhRowImages = [
    {
      src: SentinelEliminatorVortex700,
      alt: "Sentinel Eliminator Vortex 700 Filter",
    },
    { src: SentinelEliminatorVortex, alt: "Sentinel Eliminator Vortex Filter" },
    { src: SentinelLeakSealer, alt: "Sentinel Leak Sealer Solution" },
    { src: AdeyMc1Cleaner, alt: "Adey MC1 Central Heating Cleaner" },
  ];

  return (
    <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* First row - 4 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {firstRowImages.map((image, index) => (
          <div key={index} className="">
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={420}
              className="object-contain h-full rounded-lg overflow-hidden"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* Second row - 2 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="aspect-[6/3] bg-gray-100 rounded-lg"></div>
        <div className="aspect-[6/3] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Third row - 3 images */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="aspect-[4/3] bg-gray-100 rounded-lg"></div>
        <div className="aspect-[4/3] bg-gray-100 rounded-lg"></div>
        <div className="aspect-[4/3] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Fourth row - 1 wide banner */}
      <div className="mt-8">
        <div className="aspect-[21/3] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Fifth row - 4 images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {fifthRowImages.map((image, index) => (
          <div key={index} className="">
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={420}
              className="object-contain h-full rounded-lg overflow-hidden"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
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
          <div key={index} className="">
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={420}
              className="object-contain h-full rounded-lg overflow-hidden"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
