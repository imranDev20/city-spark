
import { getNavigationCategories } from "@/app/admin/categories/actions";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoriesNavigation from "../_components/categories-navigation";


import ProductsList from "../_components/products-list";
import { HomeIcon } from "lucide-react";
import { Prisma } from "@prisma/client";

export type CategoryWithRelation = Prisma.CategoryGetPayload<{
  include: {
    primaryChildCategories:true,
    primaryProducts: true,
    secondaryChildCategories: true,
    secondaryProducts:true,
    tertiaryChildCategories:true,
    tertiaryProducts: true,
  }
}>

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
    
    console.log(`categories`, categories[2].primaryChildCategories); 
  
    return (
      <>
        <div className="container grid items-center mx-auto h-[150px] bg-[#DF0023] ps-24">
          <DynamicBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-[-80px] text-3xl font-bold text-white">Products</h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
            <CategoriesNavigation  />
            <ProductsList />
          </div>
        </div>
      </>
    );
  }
  if (params.product_url.length === 1) {
    const breadcrumbItems = [
      { label: "Home", href: "/", icons: <HomeIcon size={14} color="black" /> },
      { label: "Products", href: "/products" },
      { label: `Copper Brassware`, href: `/products/${params.product_url[0]}`,isCurrentPage: true },
    ];
     let perams = params.product_url[0].toUpperCase();
    
    const categories = await getNavigationCategories(perams, params.product_url);
    console.log(`categories secondary`, categories);
    return (
      <>
        <div className="container grid items-center mx-auto h-[150px] bg-[#DF0023] ps-24">
          <DynamicBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-[-80px] text-3xl font-bold text-white">Products</h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
          <CategoriesNavigation />
            <ProductsList />
          </div>
        </div>
      </>
    );
  }
}
