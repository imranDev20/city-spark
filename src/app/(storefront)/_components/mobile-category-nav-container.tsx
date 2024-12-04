import React from "react";
import MobileCategoryNav from "./mobile-category-nav";
import { getCategoriesByType } from "../products/actions";
import { CategoryWithChildParent } from "@/types/storefront-products";

export default async function MobileCategoryNavContainer() {
  const { categories } = await getCategoriesByType("PRIMARY", "");
  const navCategories = categories as CategoryWithChildParent[];

  return <MobileCategoryNav categories={navCategories} />;
}
