import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import dummyImg from "../../../../images/dummy-img.png";

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
    <div className="lg:w-full w-96 mt-10  p-4">
      <div className="flex justify-between">
        <h2 className="font-semibold text-2xl mb-4">Best Selling Products</h2>
        <span className="flex gap-3 mt-2 mr-3 ">
          <ArrowRightIcon className="border-black border rounded-full h-5 w-5" />
          <ArrowLeftIcon className="border-black border rounded-full h-5 w-5" />
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border border-gray-400 rounded">
            <Image src={dummyImg} alt={product.name} className="mb-2" />

            <div className="flex  text-green-500 space-x-1 mb-2">
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </div>
            <h3 className=" text-sm">{product.name}</h3>
            <h2 className="text-2xl text-primary font-bold mt-2">
              {" "}
              <span className="text-lg   text-gray-400 line-through mr-2">
                £1190.99
              </span>
              £1,181.99{" "}
              <span className="text-xs text-gray-400  font-normal">
                inc. VAT
              </span>{" "}
            </h2>
            <h2 className="text-lg   font-bold  ">
              {" "}
              <span className="text-lg   text-gray-400 line-through mr-2">
                £1190.99
              </span>
              £1,181.99{" "}
              <span className="text-xs text-gray-400  font-normal">
                inc. VAT
              </span>{" "}
            </h2>
            <div className="flex justify-around bg-gray-200 mt-1  rounded-md text-lg font-bold">
              <button>+</button> <span>1</span> <button>-</button>
            </div>

            <div className="flex justify-between mt-2">
              <button className="bg-primary text-white font-semibold py-1 px-7 rounded-sm  ">
                Collection
              </button>
              <button className="bg-primary text-white font-semibold py-1 px-7 rounded-sm  ">
                Delivery
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
