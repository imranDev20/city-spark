import React from "react";
import FilterSidebar from "../filter-sidebar";
import { getBrands, getProductFilterOptions } from "../../actions";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function FilterSidebarContainer() {
  const brands = await getBrands();
  const filterOptions = await getProductFilterOptions();

  //   await wait(3000);

  return <FilterSidebar initialBrands={brands} filterOptions={filterOptions} />;
}
