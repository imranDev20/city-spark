import React from "react";
import MobileCategoryNav from "./mobile-category-nav";
import { getCategoriesByType } from "../products/actions";
import { CategoryWithChildParent } from "@/types/storefront-products";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function MobileCategoryNavContainer() {
  // await wait(1000);

  const { categories } = await getCategoriesByType("PRIMARY", "");
  const navCategories = categories as CategoryWithChildParent[];

  return <MobileCategoryNav categories={navCategories} />;
}
