import { CaretRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { ChevronUpIcon } from "lucide-react";
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
  ];

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleToggle = (categoryId:string | null) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="md:w-1/4 lg:h-5/6 p-5 m-11  bg-white rounded-lg border ">
      <h2 className="font-semibold text-2xl mb-2 flex justify-between">Categories </h2>    
      <Separator />

      <ul className="space-y-5">
        {categories.map((category, index) => (
          <li key={category.id} className="px-2">
            <div className="mb-2 flex justify-between items-center">
              <Link href={`/products/${category.id}`}>
                <p className="font-semibold  cursor-pointer">
                  {category.name}
                </p>
              </Link>
              {category.subcategories.length > 0 && (
                <div
                  onClick={() => handleToggle(category.id)}
                  className="cursor-pointer"
                >
                  {openCategory === category.id ? (
                    <ChevronDownIcon className="w-8 h-8 text-gray-500" />
                  ) : (
                    <CaretRightIcon className="w-8 h-8 text-gray-500" />
                  )}
                </div>
              )}
            </div>
            {openCategory === category.id && (
              <ul className="ml-5 mt-2 space-y-3">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <Link href={`/products/${category.name}/${subcategory.id}`}>
                      <p className="text-gray-700  cursor-pointer">
                        {subcategory.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {index < categories.length - 1 && <Separator className="my-4" />}
          </li>
          
        ))}
      </ul>
    </div>
  );
}
