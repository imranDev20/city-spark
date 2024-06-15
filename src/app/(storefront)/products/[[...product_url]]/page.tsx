// this is a catch all route
"use client";

export default function ProductsPage({
  params,
}: {
  params: {
    product_url: string;
  };
}) {
  // https://www.cityplumbing.co.uk/c/product/plumbing/plastic-pipe-and-fittings/multi-layer-pipe-and-fittings/c/1846000/
  //
  // above is a example of a url
  // the product_url will be an array. take from c-t
  // these are the categories
  // remove the use client later. We will add it on individual components

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Root products page</h1>
      <p>show all the product categories here</p>
      <a
        className="underline"
        href="https://www.cityplumbing.co.uk/c/product/c/1000000/"
      >
        Reference Here
      </a>
    </div>
  );
}
