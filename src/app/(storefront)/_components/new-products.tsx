"use client";
import { Button } from "@/components/ui/button";
import dummyImg from "@/images/dummy-img.png";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaRegStar, FaRegStarHalf } from "react-icons/fa";

export default function NewProducts() {
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
    {
      id: "5",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
    {
      id: "6",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
    {
      id: "7",
      name: "Glow-Worm Energy 18R 18kW Heat Only Boiler With Horizontal Flue Pack 10035906",
    },
  ];

  const [quantities, setQuantities] = useState<number[]>(products.map(() => 1));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
    align: "start",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const increment = (index: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] += 1;
      return newQuantities;
    });
  };

  const decrement = (index: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (newQuantities[index] > 1) {
        newQuantities[index] -= 1;
      }
      return newQuantities;
    });
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-[85%] mx-auto mt-10 p-4 mb-10">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-2xl">New Products</h2>
        <span className="flex gap-3 mr-3 text-gray-400">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={`border-gray-400 p-0.5 border rounded-full h-6 w-6 ${
              prevBtnDisabled ? "text-gray-400" : "text-black"
            }`}
          >
            <ArrowLeftIcon />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={`border-gray-400 p-0.5 border rounded-full h-6 w-6 ${
              nextBtnDisabled ? "text-gray-400" : "text-black"
            }`}
          >
            <ArrowRightIcon />
          </button>
        </span>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="p-4 border border-gray-300 rounded"
            >
              <div className="flex justify-center mb-2">
                <Image src={dummyImg} alt={product.name} />
              </div>
              <div className="flex text-[#8DD313] space-x-1 mb-2">
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStarHalf className="text-[#A3A3A3]" />
              </div>
              <h3 className="text-xs">{product.name}</h3>
              <div>
                <h2 className="text-lg text-primary font-semibold mt-1">
                  <span className="font-normal text-xs text-gray-400 line-through mr-2">
                    £1190.99
                  </span>
                  £1,181.99
                  <span className="text-xs text-gray-400 font-normal">
                    inc. VAT
                  </span>
                </h2>
                <h2 className="text-xs">
                  <span className="font-normal text-xs text-gray-400 line-through mr-2">
                    £1190.99
                  </span>
                  £1,181.99
                  <span className="text-xs text-gray-400 font-normal">
                    inc. VAT
                  </span>
                </h2>
              </div>
              <div className="flex justify-between bg-gray-200 my-2 rounded-md text-lg  ">
                <button
                  onClick={() => decrement(index)}
                  disabled={quantities[index] === 1}
                  className={`px-4 py-0.5 ${
                    quantities[index] === 1 ? "text-gray-400" : "text-black"
                  }`}
                >
                  -
                </button>
                <input
                  className="appearance-none border-none text-center w-40 bg-transparent focus:outline-none"
                  type="text"
                  value={quantities[index]}
                />
                <button
                  onClick={() => increment(index)}
                  className=" pr-4 pl-2 py-0.5"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between">
                <Button className="px-6">Collection</Button>
                <Button className="px-7">Delivery</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
