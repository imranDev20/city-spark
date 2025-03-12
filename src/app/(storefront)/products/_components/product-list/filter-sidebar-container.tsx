import React from "react";
import FilterSidebar from "./filter-sidebar";
import { getProductFilterOptions } from "../../actions";

type ProductCardsContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  search?: string;
};

export default async function FilterSidebarContainer(
  props: ProductCardsContainerProps
) {
  const {
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    search,
  } = props;

  const filterOptions = await getProductFilterOptions(
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    search
  );

  return <FilterSidebar filterOptions={filterOptions} />;
}
