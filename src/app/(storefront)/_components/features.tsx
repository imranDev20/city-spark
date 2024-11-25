import { Button } from "@/components/ui/button";
import img from "@/images/dummy-img.png";
import Image from "next/image";

const promotions = [
  {
    title: "Save Up To 40% On Boilers",
    subtitle: "Limited Time Winter Sale",
    buttonText: "SHOP DEALS",
    image: img,
    gridArea: "1 / 1 / 3 / 3",
    className: "col-span-2 row-span-2",
  },
  {
    title: "New In Bathrooms",
    subtitle: "2024 Collection",
    buttonText: "DISCOVER",
    image: img,
    gridArea: "1 / 3 / 2 / 4",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Bundle & Save",
    subtitle: "Complete Heating Packages",
    buttonText: "VIEW BUNDLES",
    image: img,
    gridArea: "2 / 3 / 3 / 4",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Trade Account",
    subtitle: "Exclusive Prices",
    buttonText: "JOIN NOW",
    image: img,
    gridArea: "3 / 1 / 4 / 2",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Clearance Sale | Up to 60% Off",
    subtitle: "While Stocks Last",
    buttonText: "SHOP SALE",
    image: img,
    gridArea: "3 / 2 / 4 / 4",
    className: "col-span-2 row-span-1 bg-secondary",
  },
];

export default function PromotionalGrid() {
  return (
    <div className="mt-10 mx-auto px-4 max-w-7xl">
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {promotions.map((promo, index) => (
          <div
            key={index}
            className={`${
              promo.className.includes("bg-secondary")
                ? "bg-secondary"
                : "bg-primary"
            } rounded-lg overflow-hidden`}
          >
            <div className="flex">
              <div className="w-[60%] p-6 py-8">
                <div className="space-y-1">
                  <p className="text-sm text-white/80 font-medium uppercase">
                    {promo.subtitle}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white uppercase">
                    {promo.title}
                  </p>
                </div>
                <Button className="bg-white hover:bg-white/90 text-black mt-4">
                  {promo.buttonText}
                </Button>
              </div>
              <div className="w-[40%] relative">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  className="object-cover h-full"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden lg:grid grid-cols-3 gap-4 mx-auto"
        style={{ gridTemplateRows: "repeat(3, minmax(180px, 1fr))" }}
      >
        {promotions.map((promo, index) => (
          <div
            key={index}
            className={`${
              promo.className.includes("bg-secondary")
                ? "bg-secondary"
                : "bg-primary"
            } rounded-lg overflow-hidden hover:shadow-lg ${promo.className}`}
            style={{
              gridArea: promo.gridArea,
            }}
          >
            <div className="flex h-full relative">
              <div className="w-[60%] p-8 flex flex-col justify-center relative z-10">
                <div className="space-y-2">
                  <p
                    className={`text-white/80 font-medium uppercase ${
                      promo.className.includes("col-span-2") &&
                      !promo.className.includes("row-span-1")
                        ? "text-lg"
                        : "text-sm"
                    }`}
                  >
                    {promo.subtitle}
                  </p>
                  <p
                    className={`font-bold text-white uppercase leading-tight ${
                      promo.className.includes("col-span-2") &&
                      !promo.className.includes("row-span-1")
                        ? "text-4xl"
                        : "text-2xl"
                    }`}
                  >
                    {promo.title}
                  </p>
                </div>
                <Button
                  className="bg-white hover:bg-white/90 text-black mt-6 w-fit font-bold"
                  size={
                    promo.className.includes("col-span-2") &&
                    !promo.className.includes("row-span-1")
                      ? "lg"
                      : "default"
                  }
                >
                  {promo.buttonText}
                </Button>
              </div>
              <div className="w-[40%] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                <Image
                  src={promo.image}
                  alt={promo.title}
                  className="object-cover"
                  fill
                  sizes={
                    promo.className.includes("col-span-2") ? "40vw" : "20vw"
                  }
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
