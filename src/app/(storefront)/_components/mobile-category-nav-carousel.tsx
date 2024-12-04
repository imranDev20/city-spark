"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CategoryType } from "@prisma/client";
import { customSlugify } from "@/lib/functions";
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

type NavCategory = {
  id: string;
  name: string;
  type: CategoryType;
  parentPrimaryCategory?: {
    id: string;
    name: string;
  } | null;
};

type CategoryWithIcon = NavCategory & {
  Icon: React.ComponentType<IconProps>;
  route: string;
};

const categoryIcons: Record<string, React.ComponentType<IconProps>> = {
  boilers: BoilerIcon,
  radiators: RadiatorIcon,
  heating: HeatingIcon,
  plumbing: PlumbingIcon,
  bathrooms: BathroomIcon,
  kitchen: KitchenTilesIcon,
  spares: SparesIcon,
  renewables: RenewablesIcon,
  tools: ToolsIcon,
  electrical: ElectricalIcon,
};

function createCategory(category: NavCategory): CategoryWithIcon | null {
  const Icon = categoryIcons[category.name.toLowerCase()];
  if (!Icon) return null;

  const route =
    category.type === CategoryType.SECONDARY && category.parentPrimaryCategory
      ? `/products/c/${customSlugify(
          category.parentPrimaryCategory.name
        )}/${customSlugify(category.name)}/c?p_id=${
          category.parentPrimaryCategory.id
        }&s_id=${category.id}`
      : `/products/c/${customSlugify(category.name)}/c?p_id=${category.id}`;

  return {
    ...category,
    Icon,
    route,
  };
}

export default function MobileCategoryNavCarousel({
  categories,
}: {
  categories: NavCategory[];
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const processedCategories = categories
    .map(createCategory)
    .filter((category): category is CategoryWithIcon => category !== null);

  return (
    <div className="pl-4 block lg:hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {processedCategories.map((item) => (
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
