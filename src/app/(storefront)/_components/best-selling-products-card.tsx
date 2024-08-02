import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { FaRegStar, FaRegStarHalf } from "react-icons/fa";

import dummyImg from "@/images/dummy-img.png";
import Image from "next/image";

export default function BestSellingProductsCard() {
  const products = [
    {
      id: "1",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
    {
      id: "2",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
    {
      id: "3",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
    {
      id: "4",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
  ];
  return (
    <div className="w-[85%] mx-auto mt-10  p-4 mb-10">
      <div className="flex justify-between">
        <h2 className="font-semibold text-2xl mb-4">Best Selling Products</h2>
        <span className="flex gap-3 mt-2 mr-3 text-gray-400 ">
          <ArrowRightIcon className="border-gray-400 p-0.5  border rounded-full h-5 w-5" />
          <ArrowLeftIcon className="border-gray-400 p-0.5  border rounded-full h-5 w-5" />
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border border-gray-300 rounded">
            <Image src={dummyImg} alt={product.name} className="mb-2" />

            <div className="flex  text-[#8DD313] space-x-1 mb-2">
              <FaRegStar />
              <FaRegStar />
              <FaRegStar />
              <FaRegStar />
              <FaRegStarHalf className="text-[#A3A3A3]" />
            </div>
            <h3 className=" text-xs ">{product.name}</h3>
            <h2 className="text-lg text-primary font-semibold mt-">
              {" "}
              <span className="font-normal text-xs text-gray-400 line-through mr-2">
                £1190.99
              </span>
              £1,181.99{" "}
              <span className="text-xs text-gray-400  font-normal">
                inc. VAT
              </span>{" "}
            </h2>
            <h2 className="text-xs">
              {" "}
              <span className="font-normal text-xs text-gray-400 line-through mr-2">
                £1190.99
              </span>
              £1,181.99{" "}
              <span className="text-xs text-gray-400  font-normal">
                inc. VAT
              </span>{" "}
            </h2>
            <div className="flex justify-between bg-gray-200 mt-1  rounded-md text-lg px-4  ">
              <button>-</button> <p>1</p> <button>+</button>
            </div>

            <div className="flex justify-between mt-2">
              <Button className="px-6">Collection</Button>
              <Button className="px-7">Delivery</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
