import { CaretRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function ProductsCategories() {
  const categories = [
    {
      id: "copper-brassware",
      name: "Copper & Brassware",
      subcategories: [],
    },
    {
      id: "plastic-pipe-fittings",
      name: "Plastic Pipe & Fittings",
      subcategories: [],
    },
    {
      id: "soil-waste",
      name: "Soil & Waste",
      subcategories: [],
    },
    {
      id: "copper-brassware",
      name: "Copper & Brassware",
      subcategories: [],
    },
    {
      id: "plastic-pipe-fittings",
      name: "Plastic Pipe & Fittings",
      subcategories: [],
    },
    {
      id: "soil-waste",
      name: "Soil & Waste",
      subcategories: [],
    },
    {
      id: "soil-waste",
      name: "Soil & Waste",
      subcategories: [],
    },
  ];
  return (
    <div className="  md:w-1/4 lg:h-5/6 p-5 m-11 bg-gray-100  rounded-lg">
      <h2 className="font-semibold  text-2xl mb-2 ">Categories</h2>
      <hr className=" border-t-2 mb-8" />

      <ul className="space-y-5">
        {categories.map((category) => (
          <li key={category.id} className="mb-2  flex justify-between">
            <Link href={`/${category.id}`}>
              <p className=" font-semibold hover:underline">{category.name}</p>
            </Link>
            <CaretRightIcon className="w-8 h-8 text-gray-500" />
          </li>
        ))}
      </ul>
    </div>
  );
}
