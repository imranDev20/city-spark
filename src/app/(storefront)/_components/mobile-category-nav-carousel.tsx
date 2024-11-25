"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CategoryType } from "@prisma/client";
import { customSlugify } from "@/lib/functions";
import { CategoryWithChildParent } from "@/types/storefront-products";
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

type IconProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
};

type PrimaryCategory = CategoryWithChildParent;
type SecondaryCategory =
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
  const isSecondary = category.type === CategoryType.SECONDARY;
  const primaryCategoryName =
    isSecondary && category.parentPrimaryCategory
      ? customSlugify(category.parentPrimaryCategory.name)
      : "";

  const route = isSecondary
    ? `/products/c/${primaryCategoryName}/${customSlugify(
        category.name
      )}/c?p_id=${category.parentPrimaryCategory?.id}&s_id=${category.id}`
    : `/products/c/${customSlugify(category.name)}/c?p_id=${category.id}`;

  return {
    ...category,
    Icon: icon,
    route,
  };
}

export default function MobileCategoryNavCarousel({
  categories,
}: {
  categories: CategoryWithChildParent[];
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

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

  return (
    <div className="pl-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {mergedCategories.map((item) => (
            <div key={item.id} className="flex-none w-[31%] min-w-[110px] pr-3">
              <Link
                href={item.route}
                className={cn(
                  "flex flex-col items-center p-4 w-full transition-all duration-200",
                  "hover:bg-primary/5 group rounded-xl",
                  "border border-border hover:border-primary/20",
                  "bg-white"
                )}
              >
                <item.Icon
                  className={cn(
                    "transition-all duration-200 text-gray-600",
                    "group-hover:text-primary group-hover:scale-110"
                  )}
                  height={32}
                  width={32}
                />
                <h5
                  className={cn(
                    "text-xs mt-3 text-center font-medium",
                    "group-hover:text-primary transition-colors duration-200"
                  )}
                >
                  {item.name}
                </h5>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
