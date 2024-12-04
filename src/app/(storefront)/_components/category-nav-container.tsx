import { CategoryWithChildParent } from "@/types/storefront-products";
import { getCategoriesByType } from "../products/actions";
import CategoryNav from "./category-nav";

export default async function CategoryNavContainer() {
  const { categories: mobileNavCategories } = await getCategoriesByType(
    "PRIMARY",
    ""
  );
  const navCategories = mobileNavCategories as CategoryWithChildParent[];

  return <CategoryNav categories={navCategories} />;
}
