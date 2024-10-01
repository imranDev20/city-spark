"use client";

import React, { useState, useRef, useTransition } from "react";
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
            template: true;
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
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (newValue: number) => {
    setQuantity(newValue);
  };

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
          <div className="mt-8">
            <h4 className="font-semibold text-xl">Product Description</h4>
            <p className="mt-4 font-normal text-[16px] leading-7">
              {inventoryItem?.product?.description}
            </p>
            <ul className="list-none space-y-2 mt-4">
              {inventoryItem?.product?.features.map((feature, index) => (
                <li key={index} className="flex items-start leading-7">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2.5 mr-4 flex-shrink-0"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold text-xl mb-4">
                Technical Specification
              </h4>
              <Table className="border-collapse border border-[#B0B0B0] w-full">
                <TableBody>
                  <TableRow className="border-b border-[#B0B0B0]">
                    <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                      Brand Name
                    </TableCell>
                    <TableCell
                      className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                      colSpan={inventoryItem?.product?.model ? undefined : 3}
                    >
                      {inventoryItem?.product?.brand?.name}
                    </TableCell>

                    {inventoryItem?.product?.model && (
                      <>
                        <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                          Model
                        </TableCell>
                        <TableCell className="bg-white border-r border-[#B0B0B0] p-2 text-center">
                          {inventoryItem.product.model}
                        </TableCell>
                      </>
                    )}
                  </TableRow>

                  {inventoryItem?.product?.productTemplate?.fields && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem.product.productTemplate.fields.map(
                        (field) => (
                          <React.Fragment key={field.id}>
                            <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                              Field Name
                            </TableCell>
                            <TableCell
                              className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                              colSpan={3}
                            >
                              {field.fieldValue}
                            </TableCell>
                          </React.Fragment>
                        )
                      )}
                    </TableRow>
                  )}

                  {(inventoryItem?.product?.warranty ||
                    inventoryItem?.product?.guarantee) && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem?.product?.guarantee && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Guarantee
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.warranty ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.guarantee}
                          </TableCell>
                        </>
                      )}
                      {inventoryItem?.product?.warranty && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Warranty
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.guarantee ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.warranty}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )}

                  {(inventoryItem?.product?.unit ||
                    inventoryItem?.product?.weight) && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem?.product?.unit && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Unit
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.weight ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.unit}
                          </TableCell>
                        </>
                      )}
                      {inventoryItem?.product?.weight && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Weight
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.unit ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.weight}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )}
                  {(inventoryItem?.product?.color ||
                    inventoryItem?.product?.length) && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem?.product?.color && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Color
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.length ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.color}
                          </TableCell>
                        </>
                      )}
                      {inventoryItem?.product?.length && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Length
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.color ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.length}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )}
                  {(inventoryItem?.product?.width ||
                    inventoryItem?.product?.height) && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem?.product?.width && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Width
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.height ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.width}
                          </TableCell>
                        </>
                      )}
                      {inventoryItem?.product?.height && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Height
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.width ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.height}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )}
                  {(inventoryItem?.product?.material ||
                    inventoryItem?.product?.volume) && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem?.product?.material && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Material
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.volume ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.material}
                          </TableCell>
                        </>
                      )}
                      {inventoryItem?.product?.volume && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Volume
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.material ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.volume}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )}
                  {(inventoryItem?.product?.type ||
                    inventoryItem?.product?.shape) && (
                    <TableRow className="border-b border-[#B0B0B0]">
                      {inventoryItem?.product?.type && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Type
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.shape ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.type}
                          </TableCell>
                        </>
                      )}
                      {inventoryItem?.product?.shape && (
                        <>
                          <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2">
                            Shape
                          </TableCell>
                          <TableCell
                            className="bg-white border-r border-[#B0B0B0] p-2 text-center"
                            colSpan={
                              inventoryItem?.product?.type ? undefined : 3
                            }
                          >
                            {inventoryItem?.product?.shape}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
                  <div className="flex justify-between bg-gray-200 my-2 rounded-md text-lg relative overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(Math.max(1, quantity - 1))
                      }
                      disabled={isPending || quantity <= 1}
                      className="absolute top-0 left-0 h-full px-4 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                    >
                      <span className="text-gray-600 font-medium select-none">
                        -
                      </span>
                    </button>
                    <input
                      className="appearance-none border-none text-center bg-transparent focus:outline-none py-1 spinner-none flex-1 font-medium"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value))
                      }
                      style={{
                        appearance: "textfield",
                      }}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={isPending}
                      className="absolute top-0 right-0 h-full px-4 flex items-center justify-center transition-colors duration-200 ease-in-out hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                    >
                      <span className="text-gray-600 font-medium select-none">
                        +
                      </span>
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
