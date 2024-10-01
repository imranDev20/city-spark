"use client";

import React from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";

type QuaternaryCategory = {
  id: string;
  name: string;
};

type TertiaryCategory = {
  id: string;
  name: string;
  tertiaryChildCategories: QuaternaryCategory[];
};

type SecondaryCategory = {
  id: string;
  name: string;
  secondaryChildCategories: TertiaryCategory[];
};

type MegaMenuCategory = {
  id: string;
  name: string;
  primaryChildCategories?: SecondaryCategory[];
  secondaryChildCategories?: TertiaryCategory[];
};

type MegaMenuProps = {
  category: MegaMenuCategory;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const MegaMenu: React.FC<MegaMenuProps> = ({
  category,
  onMouseEnter,
  onMouseLeave,
}) => {
  const isSecondaryCategory =
    category.name.toLowerCase() === "radiators" ||
    category.name.toLowerCase() === "boilers";

  return (
    <div
      className="absolute top-full left-0 w-full bg-gray-150 shadow-lg z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto max-w-screen-xl py-6">
        <div className="grid grid-cols-5 gap-6">
          {isSecondaryCategory && category.secondaryChildCategories
            ? category.secondaryChildCategories.map((tertiaryCategory) => (
                <div key={tertiaryCategory.id} className="space-y-2">
                  <Link
                    href={`/products/c/${customSlugify(
                      category.name
                    )}/${customSlugify(tertiaryCategory.name)}/c?s_id=${
                      category.id
                    }&t_id=${tertiaryCategory.id}`}
                    className="text-sm hover:text-primary transition-colors font-semibold block mb-2"
                  >
                    {tertiaryCategory.name}
                  </Link>
                  <ul className="space-y-1">
                    {tertiaryCategory.tertiaryChildCategories.map(
                      (quaternaryCategory) => (
                        <li key={quaternaryCategory.id}>
                          <Link
                            href={`/products/c/${customSlugify(
                              category.name
                            )}/${customSlugify(
                              tertiaryCategory.name
                            )}/${customSlugify(
                              quaternaryCategory.name
                            )}/c?s_id=${category.id}&t_id=${
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
              ))
            : category.primaryChildCategories?.map((secondaryCategory) => (
                <div key={secondaryCategory.id} className="space-y-2">
                  <Link
                    href={`/products/c/${customSlugify(
                      category.name
                    )}/${customSlugify(secondaryCategory.name)}/c?p_id=${
                      category.id
                    }&s_id=${secondaryCategory.id}`}
                    className="text-sm hover:text-primary transition-colors font-semibold block mb-2"
                  >
                    {secondaryCategory.name}
                  </Link>
                  <ul className="space-y-1">
                    {secondaryCategory.secondaryChildCategories.map(
                      (tertiaryCategory) => (
                        <li key={tertiaryCategory.id}>
                          <Link
                            href={`/products/c/${customSlugify(
                              category.name
                            )}/${customSlugify(
                              secondaryCategory.name
                            )}/${customSlugify(tertiaryCategory.name)}/c?p_id=${
                              category.id
                            }&s_id=${secondaryCategory.id}&t_id=${
                              tertiaryCategory.id
                            }`}
                            className="text-sm hover:text-primary transition-colors block"
                          >
                            {tertiaryCategory.name}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
