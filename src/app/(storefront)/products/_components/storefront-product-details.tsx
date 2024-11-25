"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, StarIcon, TruckIcon } from "lucide-react";
import ChecklistAddIcon from "@/components/icons/checklist-add";
import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import BranchIcon from "@/components/icons/branch";
import DeliveryIcon from "@/components/icons/delivary";
import { Transform } from "@/types/misc";
import InStockIcon from "@/components/icons/in-stock";
import PriceIcon from "@/components/icons/price";
import { Separator } from "@/components/ui/separator";
import AcceptedPayments from "../../_components/accepted-payments";
import { Prisma } from "@prisma/client";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import { customSlugify } from "@/lib/functions";

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
            fields: {
              include: {
                templateField: true;
              };
            };
            template: true;
          };
        };
      };
    };
  };
}>;

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrentPage?: boolean;
}

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

export default function StorefrontProductDetails({
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

  const product = inventoryItem.product;

  const details = [
    { label: "Brand Name", value: product.brand?.name },
    { label: "Model", value: product.model },
    ...(product.productTemplate?.fields?.map((field) => ({
      label: field.templateField.fieldName,
      value: field.fieldValue,
    })) || []),
    { label: "Guarantee", value: product.guarantee },
    { label: "Warranty", value: product.warranty },
    { label: "Unit", value: product.unit },
    { label: "Weight", value: product.weight },
    { label: "Color", value: product.color },
    { label: "Length", value: product.length },
    { label: "Width", value: product.width },
    { label: "Height", value: product.height },
    { label: "Material", value: product.material },
    { label: "Volume", value: product.volume },
    { label: "Type", value: product.type },
    { label: "Shape", value: product.shape },
  ].filter((detail) => detail.value != null);

  // Pair up the details for two-column layout
  const pairedDetails = [];
  for (let i = 0; i < details.length; i += 2) {
    pairedDetails.push(details.slice(i, i + 2));
  }

  const generateBreadcrumbItems = (
    product: InventoryItemWithRelation["product"]
  ) => {
    const items = [
      { label: "Products", href: "/products" },
    ] as BreadcrumbItem[];

    if (product.primaryCategory) {
      items.push({
        label: product.primaryCategory.name,
        href: `/products/c/${customSlugify(
          product.primaryCategory.name
        )}/c/?p_id=${product.primaryCategory.id}`,
      });
    }

    if (product.secondaryCategory) {
      items.push({
        label: product.secondaryCategory.name,
        href: `/products/c/${customSlugify(
          product?.primaryCategory?.name
        )}/${customSlugify(product.secondaryCategory.name)}/c/?p_id=${
          product?.primaryCategory?.id
        }&s_id=${product.secondaryCategory.id}`,
      });
    }

    if (product.tertiaryCategory) {
      items.push({
        label: product.tertiaryCategory.name,
        href: `/products/c/${customSlugify(
          product.primaryCategory?.name
        )}/${customSlugify(product.secondaryCategory?.name)}/${customSlugify(
          product.tertiaryCategory.name
        )}/c/?p_id=${product.primaryCategory?.id}&s_id=${
          product.secondaryCategory?.id
        }&t_id=${product.tertiaryCategory.id}`,
      });
    }

    if (product.quaternaryCategory) {
      items.push({
        label: product.quaternaryCategory.name,
        href: `/products/c/${customSlugify(
          product.primaryCategory?.name
        )}/${customSlugify(product.secondaryCategory?.name)}/${customSlugify(
          product.tertiaryCategory?.name
        )}/${customSlugify(product.quaternaryCategory.name)}/c/?p_id=${
          product.primaryCategory?.id
        }&s_id=${product.secondaryCategory?.id}&t_id=${
          product.tertiaryCategory?.id
        }&q_id=${product.quaternaryCategory.id}`,
      });
    }

    items.push({
      label: product.name,
      isCurrentPage: true,
    });

    return items;
  };

  // Inside your StorefrontProductDetails component:
  const breadcrumbItems = generateBreadcrumbItems(inventoryItem.product);

  return (
    <>
      <div className="bg-primary py-8">
        <div className="container mx-auto max-w-screen-xl">
          <DynamicBreadcrumb items={breadcrumbItems} />
        </div>
      </div>
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
                      mainImage === image ? "border-red-500" : "border-gray-300"
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
                    {pairedDetails.map((pair, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-[#B0B0B0]"
                      >
                        {pair.map((detail, detailIndex) => (
                          <React.Fragment key={detailIndex}>
                            <TableCell className="font-medium bg-gray-200 border-r border-[#B0B0B0] p-2 w-1/6">
                              {detail.label}
                            </TableCell>
                            <TableCell className="bg-white border-r border-[#B0B0B0] p-2 text-center w-1/3">
                              {detail.value}
                            </TableCell>
                          </React.Fragment>
                        ))}
                        {pair.length === 1 && (
                          <>
                            <TableCell className="bg-gray-200 border-r border-[#B0B0B0] p-2 w-1/6"></TableCell>
                            <TableCell className="bg-white p-2 w-1/3"></TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
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
    </>
  );
}
