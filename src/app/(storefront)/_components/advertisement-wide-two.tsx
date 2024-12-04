import Image from "next/image";
import { cn } from "@/lib/utils";
import WideAdvertisementTwo from "@/images/advertisements/home-wide-advertisement-two.jpg";

export default function AdvertisementWideTwo() {
  return (
    <div
      className={cn(
        "container max-w-screen-xl mx-auto my-12",
        "px-4 md:px-6 lg:px-8"
      )}
    >
      <div className="relative ">
        <Image
          src={WideAdvertisementTwo}
          alt="Brand Store Background"
          width={2000}
          height={400}
          className="rounded-lg"
          style={{
            objectFit: "contain",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          loading="lazy"
        />
      </div>
    </div>
  );
}
