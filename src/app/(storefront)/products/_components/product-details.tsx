"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, StarIcon, TruckIcon } from "lucide-react";
import ChecklistAddIcon from "@/components/icons/checklist-add";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import BranchIcon from "@/components/icons/branch";
import DeliveryIcon from "@/components/icons/delivary";
import { Transform } from "@/types/misc";
import InStockIcon from "@/components/icons/in-stock";
import PriceIcon from "@/components/icons/price";
import { Separator } from "@/components/ui/separator";
import AcceptedPayments from "../../_components/accepted-payments";
import { Prisma } from "@prisma/client";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        productTemplate: {
          include: {
            fields: true;
          };
        };
      };
    };
  };
}>;

const locationSelectionOptions = [
  {
    Icon: BranchIcon,
    title: "Select Branch",
    description: "Select branch for local availability",
  },
  {
    Icon: DeliveryIcon,
    title: "Select Delivery Location",
    description: "Enter postcode for local availability",
  },
];

const productActionOptions = [
  {
    icon: ChecklistAddIcon,
    text: "Add product in quote list",
  },
  { icon: InStockIcon, text: "Check stock in your area" },
  {
    icon: PriceIcon,
    text: (
      <>
        <Link href="/login">
          <span className="text-blue-500 font-semibold">Login</span>
        </Link>{" "}
        to get your trade price
      </>
    ),
  },
];

export default function ProductDetails({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation; // Replace 'any' with the actual type of your inventory item
}) {
  const [mainImage, setMainImage] = useState(
    inventoryItem.product.images[0] || ""
  );
  const [count, setCount] = useState(1);
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    x: 0,
    y: 0,
  });

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setTransform({ scale: 1.9, x, y });
    }
  };

  const handleMouseLeave = () => setTransform({ scale: 1, x: 50, y: 50 });

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7 pr-10">
          <div
            ref={imageRef}
            className="relative overflow-hidden rounded-lg aspect-square max-h-[450px] flex justify-center w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={mainImage}
              alt={inventoryItem.product.name}
              fill
              className="transition-transform duration-300 ease-in-out"
              style={{
                objectFit: "contain",
                transform: `scale(${transform.scale})`,
                transformOrigin: `${transform.x}% ${transform.y}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-6 gap-2 mt-8">
            {inventoryItem.product.images.map(
              (image: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`border border-gray-350 rounded-md relative h-24 ${
                    mainImage === image ? "border-red-500" : "border-gray-200"
                  } flex justify-center items-center cursor-pointer`}
                >
                  <Image
                    src={image}
                    alt={inventoryItem.product.name}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="col-span-5">
          <Card className="shadow-none border-gray-350">
            <CardContent className="p-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 text-green-450 fill-none"
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">4.99</span>
              </div>

              <h1 className="text-2xl font-semibold text-gray-800 my-5">
                {inventoryItem.product.name}
              </h1>

              <div className="mt-5">
                <span className="text-xl text-gray-500 line-through mr-4">
                  £{inventoryItem.product.contractPrice?.toFixed(2)}
                </span>
                <span className="text-2xl lg:text-3xl font-semibold text-red-600">
                  £{inventoryItem.product.tradePrice?.toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 ml-2">Inc. VAT</span>
              </div>

              <div className="space-y-8 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-100 rounded-md w-full h-10">
                    <button
                      onClick={decrement}
                      className="w-10 h-full text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      -
                    </button>
                    <div className="flex-grow text-center font-medium text-gray-700">
                      {count}
                    </div>
                    <button
                      onClick={increment}
                      className="w-10 h-full text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1 text-white h-10 flex items-center justify-center gap-2"
                    >
                      <HomeIcon className="w-4 h-4" />
                      Collection
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 h-10 flex items-center justify-center gap-2"
                    >
                      <TruckIcon className="w-4 h-4" />
                      Delivery
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-3">
                  {productActionOptions.map(({ icon: Icon, text }, index) => (
                    <div
                      key={index}
                      className="border border-gray-350 rounded-lg p-2 text-center flex flex-col items-center"
                    >
                      <div className="rounded-full border border-gray-350 flex justify-center items-center p-2 mb-2">
                        <Icon width={22} height={22} className="mx-auto" />
                      </div>
                      <p className="text-sm leading-tight">{text}</p>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-350" />

                <div>
                  <h3 className="font-semibold text-black text-lg mb-3">
                    Accepted Payment
                  </h3>
                  <AcceptedPayments />
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Where to get it
                  </h3>
                  <div className="space-y-3">
                    {locationSelectionOptions.map(
                      ({ Icon, title, description }) => (
                        <div
                          key={title}
                          className="flex items-center gap-4 p-4 border border-gray-350 rounded-lg"
                        >
                          <div className="bg-gray-150 rounded-full p-2">
                            <Icon height={24} width={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{title}</h4>
                            <p className="text-sm text-gray-600">
                              {description}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
