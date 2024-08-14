
import { getNavigationCategories } from "@/app/admin/categories/actions";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoriesNavigation, { convertToKebabCase } from "../_components/_primary/categories-navigation";


import ProductsList from "../_components/_primary/products-list";
import { HomeIcon } from "lucide-react";
import { Prisma } from "@prisma/client";
import SecondaryNavigation from "../_components/_secondary/secondary-navigation";
import SecondaryProductsList from "../_components/_secondary/products-list-secondary";

export type CategoryWithRelation = Prisma.CategoryGetPayload<{
  include: {  
    primaryChildCategories?:true,
    primaryProducts?: true,
    secondaryChildCategories?:true,
    secondaryProducts?:true,
    tertiaryChildCategories?:true,
    tertiaryProducts?:true,
    quaternaryProducts?:true,
  
  }
}>

export function convertToTitleCase(input: string): string {
  return input
    .split('-') // Split the string by hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back with spaces
}

export default async function ProductsPage({
  params,
}: {
  params: {
    product_url: string[];
  };
}) {
 
  console.log(`product_url`, params.product_url);
  
  if (!params.product_url) {
   
    const breadcrumbItems = [
      { label: "Home", href: "/", icons: <HomeIcon size={14} color="black" /> },
      { label: "Products", href: "/products", isCurrentPage: true },
    ];
    const categories = await getNavigationCategories("", params.product_url) as CategoryWithRelation[]; 
    return (
      <>
        <div className="container grid items-center mx-auto h-[150px] bg-[#DF0023] ps-24">
          <DynamicBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-[-80px] text-3xl font-bold text-white">Products</h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
            <CategoriesNavigation data={categories}  />
            <ProductsList products={categories} />
          </div>
        </div>
      </>
    );
  }
  if (params.product_url.length === 1) {
    const breadcrumbItems = [
      { label: "Home", href: "/", icons: <HomeIcon size={14} color="black" /> },
      { label: "Products", href: "/products" },
      { label: `${convertToTitleCase(params.product_url[0])}`, href: `/products/${params.product_url[0]}`,isCurrentPage: true },
    ];
   
    const names = convertToTitleCase(params.product_url[0]);
    const categoriesSecondary = await getNavigationCategories(names, params.product_url) as CategoryWithRelation[];
    console.log(`categoriesSecondary`, categoriesSecondary);
    return (
      <>
        <div className="container grid items-center mx-auto h-[150px] bg-[#DF0023] ps-24">
          <DynamicBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-[-80px] text-3xl font-bold text-white">{convertToTitleCase(params.product_url[0])}</h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
             <SecondaryNavigation data={categoriesSecondary} primaryName={params.product_url[0]} />
            <SecondaryProductsList products={categoriesSecondary} />
          </div>
        </div>
      </>
    );
  }
}
