"use client";

import React from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";
import { CategoryWithChildParent } from "@/types/storefront-products";

type CategoryType = "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY";

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
      className="absolute top-full left-0 w-full bg-white border-t border-b border-gray-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto max-w-screen-xl px-0 py-4">
        <div className="grid grid-cols-5 gap-4">
          {category.type === CategoryTypeEnum.SECONDARY
            ? (category as SecondaryCategory).secondaryChildCategories?.map(
                (tertiaryCategory) => (
                  <div key={tertiaryCategory.id}>
                    <Link
                      href={`/products/c/${customSlugify(
                        category.parentPrimaryCategory?.name
                      )}/${customSlugify(category.name)}/${customSlugify(
                        tertiaryCategory.name
                      )}/c?p_id=${category.parentPrimaryCategory?.id}&s_id=${
                        category.id
                      }&t_id=${tertiaryCategory.id}`}
                      className="font-medium text-sm text-primary block mb-2"
                    >
                      {tertiaryCategory.name}
                    </Link>
                    <ul>
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
                              className="text-sm text-gray-600 hover:text-primary block py-1"
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
                  <div key={secondaryCategory.id}>
                    <Link
                      href={`/products/c/${customSlugify(
                        category.name
                      )}/${customSlugify(secondaryCategory.name)}/c?p_id=${
                        category.id
                      }&s_id=${secondaryCategory.id}`}
                      className="font-medium text-sm text-primary block mb-2"
                    >
                      {secondaryCategory.name}
                    </Link>
                    <ul>
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
                              className="text-sm text-gray-600 hover:text-primary block py-1"
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
