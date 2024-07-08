// this is a catch all route
"use client";

export default function ProductsPage({
  params,
}: {
  params: {
    product_url: string;
  };
}) {
  return (
    <div className="container mx-auto">
      <p>productsss</p>
    </div>
  );
}
