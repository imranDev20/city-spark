import { Button } from "@/components/ui/button";

import img from "@/images/baneer-bg1.jpeg";
import Image from "next/image";

export default function BrandStore() {
  return (
    <div className="relative bg-[#DF0023]  text-white my-12 rounded-xl w-[85%] mx-auto">
      <Image
        src={img}
        alt="Brand Store Background"
        layout="fill"
        objectFit="cover"
        className="opacity-30 rounded-xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center p-10 text-center space-y-4">
        <h1 className="text-4xl font-bold">Explore Brand Store</h1>
        <p className="text-gray-100 text-sm">
          Lorem Ipsum is simply dummy text of the printing and <br />{" "}
          typesetting industry.
        </p>
        {/* <button className="px-6 py-2 bg-black rounded hover:bg-gray-700 uppercase">
          Visit Brand Shop
        </button> */}
        <Button className="bg-black hover:bg-black">Visit Brand Shop</Button>
      </div>
    </div>
  );
}
