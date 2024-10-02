"use client";

import React from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";
import { CategoryWithChildParent } from "@/types/storefront-products";

// Define CategoryType to match Prisma's definition
type CategoryType = "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY";

// Create a const object to use for comparisons
const CategoryTypeEnum = {
  PRIMARY: "PRIMARY" as CategoryType,
  SECONDARY: "SECONDARY" as CategoryType,
  TERTIARY: "TERTIARY" as CategoryType,
  QUATERNARY: "QUATERNARY" as CategoryType,
};

type IconProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
};

type PrimaryCategory = Omit<CategoryWithChildParent, "type"> & {
  type: typeof CategoryTypeEnum.PRIMARY;
};

type SecondaryCategory = Omit<
  CategoryWithChildParent["primaryChildCategories"][number],
  "type"
> & {
  type: typeof CategoryTypeEnum.SECONDARY;
};

type Category = PrimaryCategory | SecondaryCategory;

type CategoryWithParent = Category & {
  Icon: React.ComponentType<IconProps>;
  route: string;
};

type MegaMenuProps = {
  category: CategoryWithParent;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const MegaMenu: React.FC<MegaMenuProps> = ({
  category,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="absolute top-full left-0 w-full bg-gray-150 shadow-lg z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto max-w-screen-xl py-6">
        <div className="grid grid-cols-5 gap-6">
          {category.type === CategoryTypeEnum.SECONDARY
            ? (category as SecondaryCategory).secondaryChildCategories?.map(
                (tertiaryCategory) => (
                  <div key={tertiaryCategory.id} className="space-y-2">
                    <Link
                      href={`/products/c/${customSlugify(
                        category.parentPrimaryCategory?.name
                      )}/${customSlugify(category.name)}/${customSlugify(
                        tertiaryCategory.name
                      )}/c?p_id=${category.parentPrimaryCategory?.id}&s_id=${
                        category.id
                      }&t_id=${tertiaryCategory.id}`}
                      className="text-sm hover:text-primary transition-colors font-medium block mb-2"
                    >
                      {tertiaryCategory.name}
                    </Link>
                    <ul className="space-y-1">
                      {tertiaryCategory.tertiaryChildCategories?.map(
                        (quaternaryCategory) => (
                          <li key={quaternaryCategory.id}>
                            <Link
                              href={`/products/c/${customSlugify(
                                category.parentPrimaryCategory?.name
                              )}/${customSlugify(
                                category.name
                              )}/${customSlugify(
                                tertiaryCategory.name
                              )}/${customSlugify(
                                quaternaryCategory.name
                              )}/c?p_id=${
                                category.parentPrimaryCategory?.id
                              }&s_id=${category.id}&t_id=${
                                tertiaryCategory.id
                              }&q_id=${quaternaryCategory.id}`}
                              className="text-sm hover:text-primary transition-colors block"
                            >
                              {quaternaryCategory.name}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )
              )
            : (category as PrimaryCategory).primaryChildCategories?.map(
                (secondaryCategory) => (
                  <div key={secondaryCategory.id} className="space-y-2">
                    <Link
                      href={`/products/c/${customSlugify(
                        category.name
                      )}/${customSlugify(secondaryCategory.name)}/c?p_id=${
                        category.id
                      }&s_id=${secondaryCategory.id}`}
                      className="text-sm hover:text-primary transition-colors font-medium block mb-2"
                    >
                      {secondaryCategory.name}
                    </Link>
                    <ul className="space-y-1">
                      {secondaryCategory.secondaryChildCategories?.map(
                        (tertiaryCategory) => (
                          <li key={tertiaryCategory.id}>
                            <Link
                              href={`/products/c/${customSlugify(
                                category.name
                              )}/${customSlugify(
                                secondaryCategory.name
                              )}/${customSlugify(
                                tertiaryCategory.name
                              )}/c?p_id=${category.id}&s_id=${
                                secondaryCategory.id
                              }&t_id=${tertiaryCategory.id}`}
                              className="text-sm hover:text-primary transition-colors block"
                            >
                              {tertiaryCategory.name}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )
              )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
