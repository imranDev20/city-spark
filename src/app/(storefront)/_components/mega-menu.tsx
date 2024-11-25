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
  onCloseMenu: () => void;
};

const MegaMenu: React.FC<MegaMenuProps> = ({
  category,
  onMouseEnter,
  onMouseLeave,
  onCloseMenu,
}) => {
  const renderContent = () => {
    if (category.type === CategoryTypeEnum.SECONDARY) {
      const secondaryCategory = category as SecondaryCategory;
      if (!secondaryCategory.secondaryChildCategories?.length) {
        return (
          <div className="col-span-5 flex items-center justify-center text-muted-foreground">
            No categories found
          </div>
        );
      }

      return secondaryCategory.secondaryChildCategories?.map(
        (tertiaryCategory) => (
          <div key={tertiaryCategory.id} className="flex flex-col">
            <Link
              href={`/products/c/${customSlugify(
                category.parentPrimaryCategory?.name
              )}/${customSlugify(category.name)}/${customSlugify(
                tertiaryCategory.name
              )}/c?p_id=${category.parentPrimaryCategory?.id}&s_id=${
                category.id
              }&t_id=${tertiaryCategory.id}`}
              onClick={onCloseMenu}
              className="font-medium text-sm text-primary block mb-2 hover:underline"
            >
              {tertiaryCategory.name}
            </Link>
            <ul className="flex-1">
              {tertiaryCategory.tertiaryChildCategories?.map(
                (quaternaryCategory) => (
                  <li key={quaternaryCategory.id}>
                    <Link
                      href={`/products/c/${customSlugify(
                        category.parentPrimaryCategory?.name
                      )}/${customSlugify(category.name)}/${customSlugify(
                        tertiaryCategory.name
                      )}/${customSlugify(quaternaryCategory.name)}/c?p_id=${
                        category.parentPrimaryCategory?.id
                      }&s_id=${category.id}&t_id=${tertiaryCategory.id}&q_id=${
                        quaternaryCategory.id
                      }`}
                      onClick={onCloseMenu}
                      className="text-sm text-gray-600 hover:text-primary block py-1 hover:underline"
                    >
                      {quaternaryCategory.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        )
      );
    }

    const primaryCategory = category as PrimaryCategory;
    if (!primaryCategory.primaryChildCategories?.length) {
      return (
        <div className="col-span-5 flex items-center justify-center text-muted-foreground">
          No categories found
        </div>
      );
    }

    return primaryCategory.primaryChildCategories?.map((secondaryCategory) => (
      <div key={secondaryCategory.id} className="flex flex-col">
        <Link
          href={`/products/c/${customSlugify(category.name)}/${customSlugify(
            secondaryCategory.name
          )}/c?p_id=${category.id}&s_id=${secondaryCategory.id}`}
          onClick={onCloseMenu}
          className="font-medium text-sm text-primary block mb-2 hover:underline"
        >
          {secondaryCategory.name}
        </Link>
        <ul className="flex-1">
          {secondaryCategory.secondaryChildCategories?.map(
            (tertiaryCategory) => (
              <li key={tertiaryCategory.id}>
                <Link
                  href={`/products/c/${customSlugify(
                    category.name
                  )}/${customSlugify(secondaryCategory.name)}/${customSlugify(
                    tertiaryCategory.name
                  )}/c?p_id=${category.id}&s_id=${secondaryCategory.id}&t_id=${
                    tertiaryCategory.id
                  }`}
                  onClick={onCloseMenu}
                  className="text-sm text-gray-600 hover:text-primary block py-1 hover:underline"
                >
                  {tertiaryCategory.name}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    ));
  };

  return (
    <div
      className="absolute top-full left-0 w-full bg-muted border-b border-gray-300 shadow-lg z-10 border-t"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto max-w-screen-xl px-0 py-4">
        <div className="h-96 overflow-y-auto">
          <div className="grid grid-cols-5 gap-4 min-h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
