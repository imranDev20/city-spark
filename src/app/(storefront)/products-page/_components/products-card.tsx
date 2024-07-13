import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import dummyImg from "../../../../images/new-pass-img.jpg";

export default function ProductsCart() {
  const products = [
    {
      id: "1",
      category: "copper-brassware",
      name: "Copper Fitting",
    },
    {
      id: "2",
      category: "plastic-pipe-fittings",
      name: "Plastic Pipe",
    },
    {
      id: "3",
      category: "soil-waste",
      name: "Waste Drain",
    },
    {
      id: "4",
      category: "copper-brassware",
      name: "Copper Fitting",
    },
    {
      id: "5",
      category: "plastic-pipe-fittings",
      name: "Plastic Pipe",
    },
    {
      id: "6",
      category: "soil-waste",
      name: "Waste Drain",
    },
  ];

  return (
    <div className="w-full md:w-3/4 p-4">
      <h2 className="font-semibold text-2xl mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded">
            <Image src={dummyImg} alt={product.name} className="mb-2" />
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <div className="flex mb-2">
                <StarFilledIcon />
                <StarFilledIcon />
                <StarFilledIcon />
                <StarIcon />
                <StarIcon />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button className="bg-secondary text-white font-semibold py-1 px-6 rounded-sm  ">
                Collection
              </button>
              <button className="bg-secondary text-white font-semibold py-1 px-6 rounded-sm  ">
                Delivery
              </button>
            </div>
            <h2 className="text-2xl font-bold mt-2">
              £80.12 <span className="text-xs font-normal">including VAT</span>{" "}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
