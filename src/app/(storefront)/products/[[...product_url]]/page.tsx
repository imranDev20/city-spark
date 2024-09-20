import React from "react";
import FirstCategoriesPage from "../_components/first-categories-page";
import SecondCategoriesPage from "../_components/second-categories-page";
import ThirdCategoriesPage from "../_components/third-categories-page";
import FourthCategoriesPage from "../_components/fourth-categories-page";
import StorefrontProductList from "../_components/storefront-product-list";
import ProductDetails from "../_components/product-details";
import { getInventoryItem } from "../../actions";

const getCategoryFromUrl = (product_url: string[] | undefined): string[] => {
  if (!product_url || !Array.isArray(product_url)) {
    return [];
  }

  const startIndex = product_url.indexOf("c");
  if (startIndex === -1) {
    return [];
  }

  const endIndex = product_url.indexOf("c", startIndex + 1);
  return endIndex === -1
    ? product_url.slice(startIndex + 1)
    : product_url.slice(startIndex + 1, endIndex);
};

export default async function StorefrontProductsPage({
  params: { product_url },
  searchParams: { p_id, s_id, t_id, q_id },
}: {
  params: {
    product_url?: string[];
  };
  searchParams: {
    p_id?: string;
    s_id?: string;
    t_id?: string;
    q_id?: string;
  };
}) {
  const result = getCategoryFromUrl(product_url);

  // Check for product details page
  if (
    product_url &&
    product_url.length === 4 &&
    product_url[0] === "p" &&
    product_url[2] === "p"
  ) {
    const inventoryItemId = product_url[3];
    const inventoryItem = await getInventoryItem(inventoryItemId);

    return <ProductDetails inventoryItem={inventoryItem} />;
  }

  if (result?.length === 4) {
    console.log("lengh -4 ");
    return (
      <StorefrontProductList
        isPrimaryRequired
        isSecondaryRequired
        isTertiaryRequired
        isQuaternaryRequired
        primaryCategoryId={p_id}
        secondaryCategoryId={s_id}
        tertiaryCategoryId={t_id}
        quaternaryCategoryId={q_id}
      />
    );
  }

  if (result?.length === 3) {
    console.log("lengh - 3");
    return (
      <FourthCategoriesPage
        primaryId={p_id}
        secondaryId={s_id}
        tertiaryId={t_id}
      />
    );
  }

  if (result?.length === 2) {
    console.log("lengh - 2");

    return <ThirdCategoriesPage primaryId={p_id} secondaryId={s_id} />;
  }

  if (result?.length === 1) {
    console.log("lengh - 1");
    return <SecondCategoriesPage primaryId={p_id} />;
  }

  if (!product_url || product_url.length === 0) {
    console.log("lengh -0");

    return <FirstCategoriesPage />;
  }

  return <div>Page not available</div>;
}
