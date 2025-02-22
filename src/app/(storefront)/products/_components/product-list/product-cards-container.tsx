import React from "react";
import { getCategoryById } from "../../actions";
import { getInventoryItemsForStorefront } from "@/app/(storefront)/actions";
import BannerImage from "@/images/category-banner.png";
import Image from "next/image";
import ProductCardsLoadMore from "./product-cards-load-more";
import SortProducts from "./sort-products";
import FulFillmentOptions from "./fulfillment-options";

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
  let pageTitle = isSearch ? `Search Results for "${search}"` : "Products";

  if (isQuaternaryRequired && quaternaryCategoryId) {
    currentCategory = await getCategoryById(quaternaryCategoryId);
  } else if (isTertiaryRequired && tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
  } else if (isSecondaryRequired && secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
  } else if (isPrimaryRequired && primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
  }

  if (currentCategory) {
    pageTitle = currentCategory.name;
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
      <h2 className="text-2xl font-semibold lg:hidden">{pageTitle}</h2>
      <p className="mb-4 text-muted-foreground block lg:hidden">
        {totalCount} Products
      </p>

      <div className="h-24 lg:h-52 relative">
        <Image
          src={BannerImage}
          alt=""
          className="w-full h-auto rounded-lg"
          placeholder="blur"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
        />
      </div>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4 lg:mt-6">
        <p className="text-base text-gray-600 hidden lg:block">
          Showing{" "}
          <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
          {totalCount === 1 ? "product" : "products"}
        </p>

        <div className="items-center gap-2 hidden lg:flex">
          <SortProducts />
        </div>
      </div>

      <FulFillmentOptions />

      <ProductCardsLoadMore
        initialData={inventoryItems}
        initialTotalCount={totalCount}
        {...props}
      />
    </>
  );
}
