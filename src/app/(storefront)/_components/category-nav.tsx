import { CategoryWithChildParent } from "@/types/storefront-products";
import { getCategoriesByType } from "../products/actions";
import CategoryNavComponent from "./category-nav-component";

export default async function CategoryNav() {
  const { categories } = await getCategoriesByType("PRIMARY", "");
  const navCategories = categories as CategoryWithChildParent[];

  return <CategoryNavComponent categories={navCategories} />;
}
