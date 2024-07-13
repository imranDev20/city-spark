// this is a catch all route
"use client";

import ProductsCategories from "../_components/categories";
import ProductsCart from "../_components/products-cart";

export default function ProductsPage({
  params,
}: {
  params: {
    product_url: string;
  };
}) {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row">
        <ProductsCategories />
        <ProductsCart />
      </div>
    </div>
  );
}
