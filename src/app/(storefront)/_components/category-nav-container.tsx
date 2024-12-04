import { CategoryWithChildParent } from "@/types/storefront-products";
import { getCategoriesByType } from "../products/actions";
import CategoryNav from "./category-nav";
import { getDeviceType } from "@/lib/server-utils";

export default async function CategoryNavContainer() {
  const { isDesktop } = await getDeviceType();

  // Only fetch and render for desktop devices
  if (isDesktop) {
    const { categories: mobileNavCategories } = await getCategoriesByType(
      "PRIMARY",
      ""
    );
    const navCategories = mobileNavCategories as CategoryWithChildParent[];

    return <CategoryNav categories={navCategories} />;
  }

  // Return null for mobile devices
  return null;
}
