import React from "react";
import FilterSidebar from "../filter-sidebar";
import { getBrands, getProductFilterOptions } from "../../actions";

export default async function FilterSidebarContainer() {
  const brands = await getBrands();
  const filterOptions = await getProductFilterOptions();

  return <FilterSidebar initialBrands={brands} filterOptions={filterOptions} />;
}
