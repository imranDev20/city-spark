"use client";
import { CaretRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { CategoryWithRelation } from "../../[[...product_url]]/page";
export function convertToKebabCase(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, '-');
}

export default function CategoriesNavigation({data}:{data:CategoryWithRelation[]}) {
  

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const handleToggle = (categoryId:string | null) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="lg:w-[332px] lg:h-5/6 mt-6 ms-7 bg-white rounded-lg border">
      <h2 className="font-semibold text-[18px] ps-4 py-[18px]">Categories </h2>    
      <Separator />

      <ul>
        {data?.map((values:any, index:any) => (
         
          <li key={values.id}>
            <div className="flex justify-between items-center px-6 py-3">
              <Link href={`/products/${convertToKebabCase(values.name)}`}>
                <p className={`${openCategory === values.id ? 'font-semibold' : 'font-normal'} text-[16px] py-3 ps-6 cursor-pointer`}>
                  {values.name}
                </p>
              </Link>
              {values.primaryChildCategories.length > 0 && (
                <div
                  onClick={() => handleToggle(values.id)}
                  className="cursor-pointer"
                >
                  {openCategory === values.id ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <CaretRightIcon className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              )}
            </div>
            {openCategory === values.id && (
              <ul className="ml-4 -mt-5">
                {values.primaryChildCategories.map((subcategory : any) => (
                  <li key={subcategory.id} className="">
                    <Link href={`/products/${convertToKebabCase(values.name)}/${convertToKebabCase(subcategory.name)}`}>
                      <p className="text-[16px] font-normal ps-12 py-3  cursor-pointer">
                        {subcategory.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {index < data?.length - 1 && <Separator  />}
          </li>

        ))}
      </ul>
    </div>
  );
}