import React from "react";
import { Metadata } from "next";
import FirstCategoriesPage from "../_components/first-categories-page";
import SecondCategoriesPage from "../_components/second-categories-page";
import ThirdCategoriesPage from "../_components/third-categories-page";
import FourthCategoriesPage from "../_components/fourth-categories-page";
import StorefrontProductList from "../_components/storefront-product-list";
import StorefrontProductDetails from "../_components/storefront-product-details";
import { getInventoryItem } from "../../actions";

type PageParams = Promise<{
  product_url?: string[];
}>;

type SearchParams = Promise<{
  p_id?: string;
  s_id?: string;
  t_id?: string;
  q_id?: string;
  search?: string;
}>;

export async function generateMetadata(props: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await props.params;

  if (params.product_url?.[0] === "p" && params.product_url?.[2] === "p") {
    const inventoryItem = await getInventoryItem(params.product_url[3]);
    return {
      title: inventoryItem.product.name,
      description: inventoryItem.product.description || "Product details",
    };
  }

  return {
    title: "Products",
    description: "Browse our products",
  };
}

const getCategoryFromUrl = async (
  product_url: string[] | undefined
): Promise<string[]> => {
  if (!product_url?.length) return [];

  const startIndex = product_url.indexOf("c");
  if (startIndex === -1) return [];

  const endIndex = product_url.indexOf("c", startIndex + 1);
  return endIndex === -1
    ? product_url.slice(startIndex + 1)
    : product_url.slice(startIndex + 1, endIndex);
};

export default async function StorefrontProductsPage(props: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const categories = await getCategoryFromUrl(params.product_url);

  if (params.product_url?.[0] === "p" && params.product_url?.[2] === "p") {
    const inventoryItem = await getInventoryItem(params.product_url[3]);
    return <StorefrontProductDetails inventoryItem={inventoryItem} />;
  }

  if (searchParams.search) {
    return <StorefrontProductList isSearch search={searchParams.search} />;
  }

  if (categories.length === 4) {
    return (
      <StorefrontProductList
        isPrimaryRequired
        isSecondaryRequired
        isTertiaryRequired
        isQuaternaryRequired
        primaryCategoryId={searchParams.p_id}
        secondaryCategoryId={searchParams.s_id}
        tertiaryCategoryId={searchParams.t_id}
        quaternaryCategoryId={searchParams.q_id}
      />
    );
  }

  if (categories.length === 3) {
    return (
      <FourthCategoriesPage
        primaryId={searchParams.p_id}
        secondaryId={searchParams.s_id}
        tertiaryId={searchParams.t_id}
      />
    );
  }

  if (categories.length === 2) {
    return (
      <ThirdCategoriesPage
        primaryId={searchParams.p_id}
        secondaryId={searchParams.s_id}
      />
    );
  }

  if (categories.length === 1) {
    return <SecondCategoriesPage primaryId={searchParams.p_id} />;
  }

  if (!params.product_url?.length) {
    return <FirstCategoriesPage />;
  }

  return <div>Page not available</div>;
}
