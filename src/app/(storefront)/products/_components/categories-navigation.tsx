"use client";
import { CaretRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CategoriesNavigation() {
  const categories = [
    {
      id: "copper-brassware",
      name: "Copper & Brassware",
      subcategories: [
        { id: "copper-pipes", name: "Copper Pipes" },
        { id: "brass-fittings", name: "Brass Fittings" },
      ],
    },
    {
      id: "plastic-pipe-fittings",
      name: "Plastic Pipe & Fittings",
      subcategories: [
        { id: "pvc-pipes", name: "PVC Pipes" },
        { id: "ppr-fittings", name: "PPR Fittings" },
      ],
    },
    {
      id: "soil-waste",
      name: "Soil & Waste",
      subcategories: [
        { id: "soil-pipes", name: "Soil Pipes" },
        { id: "waste-pipes", name: "Waste Pipes" },
      ],
    },
    {
      id: "five",
      name: "Soil & Waste",
      subcategories: [
        { id: "soil-pipes", name: "Soil Pipes" },
        { id: "waste-pipes", name: "Waste Pipes" },
      ],
    },
  ];

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleToggle = (categoryId:string | null) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="lg:w-[332px] lg:h-5/6 p-5 mt-6 ms-7  bg-white rounded-lg border ">
      <h2 className="font-semibold text-[18px] ps-4 py-[18px]">Categories </h2>    
      <Separator />

      <ul className="">
        {categories.map((category, index) => (
          <li key={category.id} className="">
            <div className="flex justify-between items-center">
              <Link href={`/products/${category.id}`}>
              <p className={`${openCategory == category.id ? 'font-semibold' : 'font-normal'} text-[16px] py-3 ps-6 cursor-pointer`}>
                  {category.name}
                </p>
              </Link>
              {category.subcategories.length > 0 && (
                <div
                  onClick={() => handleToggle(category.id)}
                  className="cursor-pointer"
                >
                  {openCategory === category.id ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-700" />
                  ) : (
                    <CaretRightIcon className="w-4 h-4  text-gray-700" />
                  )}
                </div>
              )}
            </div>
            {openCategory === category.id && (
              <ul className="ml-5 mt-2 space-y-3">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <Link href={`/products/${category.id}/${subcategory.id}`}>
                      <p className={ `font-normal text-[16px] ps-8 py-3  cursor-pointer`}>
                        {subcategory.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {index < categories.length - 1 && <Separator />}
          </li>
          
        ))}
      </ul>
    </div>
  );
}
