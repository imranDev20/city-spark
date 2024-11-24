"use client";

import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";
import { cn } from "@/lib/utils";
import MegaMenu from "./mega-menu";
import BoilerIcon from "@/components/icons/boiler";
import RadiatorIcon from "@/components/icons/radiator";
import HeatingIcon from "@/components/icons/heating";
import PlumbingIcon from "@/components/icons/plumbing";
import BathroomIcon from "@/components/icons/bathroom";
import KitchenTilesIcon from "@/components/icons/kitchen-tiles";
import SparesIcon from "@/components/icons/spares";
import RenewablesIcon from "@/components/icons/renewables";
import ToolsIcon from "@/components/icons/tools";
import ElectricalIcon from "@/components/icons/electrical";
import { CategoryWithChildParent } from "@/types/storefront-products";
import { CategoryType } from "@prisma/client";

type IconProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
};

type PrimaryCategory = CategoryWithChildParent;
export type SecondaryCategory =
  CategoryWithChildParent["primaryChildCategories"][number];

type CategoryWithParent<T extends PrimaryCategory | SecondaryCategory> = T & {
  Icon: React.ComponentType<IconProps>;
  route: string;
};

const categoryData: { label: string; Icon: React.ComponentType<IconProps> }[] =
  [
    { label: "Boilers", Icon: BoilerIcon },
    { label: "Radiators", Icon: RadiatorIcon },
    { label: "Heating", Icon: HeatingIcon },
    { label: "Plumbing", Icon: PlumbingIcon },
    { label: "Bathrooms", Icon: BathroomIcon },
    { label: "Kitchen", Icon: KitchenTilesIcon },
    { label: "Spares", Icon: SparesIcon },
    { label: "Renewables", Icon: RenewablesIcon },
    { label: "Tools", Icon: ToolsIcon },
    { label: "Electrical", Icon: ElectricalIcon },
  ];

function createMergedCategory<T extends PrimaryCategory | SecondaryCategory>(
  category: T,
  icon: React.ComponentType<IconProps>
): CategoryWithParent<T> {
  return {
    ...category,
    Icon: icon,
    route: `/products/c/${customSlugify(category?.name)}/c?p_id=${
      category?.id
    }${
      category &&
      category?.type === CategoryType.SECONDARY &&
      category?.parentPrimaryCategory
        ? `&s_id=${category.id}`
        : ""
    }`,
  };
}

export default function CategoryNavComponent({
  categories,
}: {
  categories: CategoryWithChildParent[];
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const excludedRoutes = ["/login", "/register", "/cart", "/checkout"];

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  const mergedCategories: CategoryWithParent<
    PrimaryCategory | SecondaryCategory
  >[] = categoryData.flatMap(
    (item): CategoryWithParent<PrimaryCategory | SecondaryCategory>[] => {
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === item.label.toLowerCase()
      );

      if (category) {
        if (category.name.toLowerCase() === "heating") {
          const result: CategoryWithParent<
            PrimaryCategory | SecondaryCategory
          >[] = [];

          const boilers = category.primaryChildCategories?.find(
            (subcat) => subcat.name.toLowerCase() === "boilers"
          );
          const radiators = category.primaryChildCategories?.find(
            (subcat) => subcat.name.toLowerCase() === "radiators"
          );

          if (boilers) {
            result.push(
              createMergedCategory(boilers as SecondaryCategory, BoilerIcon)
            );
          }

          if (radiators) {
            result.push(
              createMergedCategory(radiators as SecondaryCategory, RadiatorIcon)
            );
          }

          result.push(
            createMergedCategory(category as PrimaryCategory, item.Icon)
          );

          return result;
        }

        return [
          createMergedCategory(
            category.type === CategoryType.PRIMARY
              ? (category as PrimaryCategory)
              : (category as SecondaryCategory),
            item.Icon
          ),
        ];
      }

      return [];
    }
  );

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100);
  };

  return (
    <div className="relative bg-white shadow-sm border-b">
      <div className="container mx-auto max-w-screen-xl px-0">
        <div className="flex w-full">
          {mergedCategories.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex-1 relative group border-r last:border-r-0 border-gray-100",
                hoveredCategory === item.id && "bg-primary/5"
              )}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.route}
                className={cn(
                  "flex flex-col items-center p-4 h-24 w-full transition-all duration-200 hover:bg-primary/5",
                  "relative overflow-hidden"
                )}
              >
                <div className="relative z-10 flex flex-col items-center w-full">
                  <item.Icon
                    className={cn(
                      "transition-all duration-200 text-gray-600",
                      "group-hover:text-primary group-hover:scale-110",
                      hoveredCategory === item.id && "text-primary scale-110"
                    )}
                    height={28}
                    width={28}
                  />
                  <h5
                    className={cn(
                      "text-sm mt-2 text-center font-medium px-1",
                      "group-hover:text-primary transition-colors duration-200",
                      hoveredCategory === item.id && "text-primary"
                    )}
                  >
                    {item.name}
                  </h5>
                </div>
                <div
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-200",
                    "group-hover:scale-x-100",
                    hoveredCategory === item.id && "scale-x-100"
                  )}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
      {hoveredCategory && (
        <MegaMenu
          category={
            mergedCategories.find((c) => c.id === hoveredCategory) ||
            mergedCategories[0]
          }
          onMouseEnter={() => handleMouseEnter(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}
