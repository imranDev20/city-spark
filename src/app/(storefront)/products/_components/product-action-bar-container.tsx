import React from "react";
import ProductActionBar from "./product-action-bar";
import { getProductFilterOptions } from "../actions";

type ProductActionBarContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
};

export default async function ProductActionBarContainer(
  props: ProductActionBarContainerProps
) {
  const {
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
  } = props;

  const filterOptions = await getProductFilterOptions(
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId
  );

  return <ProductActionBar filterOptions={filterOptions} />;
}
