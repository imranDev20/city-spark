"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import PlaceholderImage from "@/images/placeholder-image.jpg";
import { Prisma } from "@prisma/client";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaRegStar, FaRegStarHalf } from "react-icons/fa";

export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

export default function NewProductsCard({
  items,
}: {
  items: InventoryWithRelations[];
}) {
  console.log(items);
  const {
    addToCollectionCart,
    collectionCart,
    deliveryCart,
    addToDeliveryCart,
  } = useCart();

  // Map quantities from the cart or initialize to 1
  const [quantities, setQuantities] = useState<number[]>(
    items.map((item) => {
      const productInCart = collectionCart.find(
        (cartItem) => cartItem.id === item.id
      );
      return productInCart ? productInCart.quantity : 1;
    })
  );

  const handleAddToCart = (index: number) => {
    // const quantityToAdd = Math.min(quantities[index], item.stockCount);

    const product = {
      id: items[index].product.id,
      name: items[index].product.name,
      price: 1181.99, // Replace with actual price from items[index] if available
      quantity: quantities[index],
      stock: items[index].stockCount,
    };
    addToCollectionCart(product);
  };
  const handleAddToDeliveryCart = (index: number) => {
    // const quantityToAdd = Math.min(quantities[index], item.stockCount);

    const product = {
      id: items[index].product.id,
      name: items[index].product.name,
      price: 1181.99, // Replace with actual price from items[index] if available
      quantity: quantities[index],
      stock: items[index].stockCount,
    };
    addToDeliveryCart(product);
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
    align: "start",
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const increment = (index: number, stockCount: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (newQuantities[index] < stockCount) {
        newQuantities[index] += 1;
      }
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
          {items.map((item, index) => (
            <div key={item.id} className="p-4 border border-gray-300 rounded">
              <div className="flex justify-center mb-2">
                {item.product.images[0] ? (
                  <Image src={item.product.images[0]} alt={"img"} />
                ) : (
                  <Image
                    src={PlaceholderImage}
                    width="200"
                    alt="PlaceholderImage"
                  />
                )}
              </div>
              <div className="flex text-[#8DD313] space-x-1 mb-2">
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStar />
                <FaRegStarHalf className="text-[#A3A3A3]" />
              </div>
              <h3 className="text-sm line-clamp-2">{item.product.name}</h3>
              <h3 className="text-sm">In stock: {item?.stockCount}</h3>
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
                  onClick={() => increment(index, item.stockCount)}
                  disabled={quantities[index] >= item.stockCount}
                  className={`pr-4 pl-2 py-0.5 ${
                    quantities[index] >= item.stockCount
                      ? "text-gray-400"
                      : "text-black"
                  }`}
                >
                  +
                </button>
              </div>
              <div className="flex justify-between">
                <Button onClick={() => handleAddToCart(index)} className="px-6">
                  Collection
                </Button>
                <Button
                  onClick={() => handleAddToDeliveryCart(index)}
                  className="px-7"
                >
                  Delivery
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
