import React from "react";
import { getCategoryById } from "../../actions";
import { getInventoryItemsForStorefront } from "@/app/(storefront)/actions";

import ProductCardsLoadMore from "./product-cards-load-more";

type ProductCardsContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
};

export default async function ProductCardsContainer(
  props: ProductCardsContainerProps
) {
  const {
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    isPrimaryRequired,
    isSecondaryRequired,
    isTertiaryRequired,
    isQuaternaryRequired,
    isSearch,
    search,
  } = props;

  let currentCategory;

  if (isQuaternaryRequired && quaternaryCategoryId) {
    currentCategory = await getCategoryById(quaternaryCategoryId);
  } else if (isTertiaryRequired && tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
  } else if (isSecondaryRequired && secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
  } else if (isPrimaryRequired && primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
  }

  const { inventoryItems, totalCount } = await getInventoryItemsForStorefront({
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    isPrimaryRequired,
    isSecondaryRequired,
    isTertiaryRequired,
    isQuaternaryRequired,
    search: isSearch ? search : undefined,
  });

  return (
    <>
      <h2 className="text-2xl font-semibold lg:hidden">
        {currentCategory?.name}
      </h2>

      <ProductCardsLoadMore
        initialData={inventoryItems}
        initialTotalCount={totalCount}
        {...props}
      />
    </>
  );
}
