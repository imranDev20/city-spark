import { Prisma } from "@prisma/client";
import { getCategoriesByType } from "../products/actions";
import CategoryNavComponent from "./category-nav-component";

type PrimaryCategoryWithChilds = Prisma.CategoryGetPayload<{
  include: {
    primaryChildCategories: {
      include: {
        secondaryChildCategories: {
          include: {
            tertiaryChildCategories: true;
          };
        };
      };
    };
  };
}>;

export default async function CategoryNav() {
  const { categories } = await getCategoriesByType("PRIMARY", "");
  const navCategories = categories as PrimaryCategoryWithChilds[];

  return <CategoryNavComponent categories={navCategories} />;
}
