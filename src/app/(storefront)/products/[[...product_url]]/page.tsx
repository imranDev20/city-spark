// this is a catch all route
// "use client";

import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoriesNavigation from "../_components/categories-navigation";
import CategoriesNavigationPage from "../_components/categories-page";

import ProductsList from "../_components/products-list";
import { HomeIcon } from "lucide-react";

export default function ProductsPage({
  params,
}: {
  params: {
    product_url: string[];
  };
}) {
  const breadcrumbItems = [
    { label: "Home", href: "/", icons: <HomeIcon size={14} color="black" /> },
    { label: "Products", href: "/products", isCurrentPage: true },
  ];
  console.log(`product_url`, params.product_url);
  if (!params.product_url) {
    return (
      <>
        <div className="container grid items-center mx-auto h-[150px] bg-[#DF0023] ps-24">
          <DynamicBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-[-80px] text-3xl font-bold text-white">Products</h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
            <CategoriesNavigationPage />
            <ProductsList />
          </div>
        </div>
      </>
    );
  }
  if (params.product_url.length === 1) {
    return (
      <>
        <div className="container grid items-center mx-auto h-[150px] bg-[#DF0023] ps-24">
          <DynamicBreadcrumb items={breadcrumbItems} />
          <h1 className="mt-[-80px] text-3xl font-bold text-white">Products</h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 md:flex-row">
            <CategoriesNavigationPage />
            <ProductsList />
          </div>
        </div>
      </>
    );
  }
}
