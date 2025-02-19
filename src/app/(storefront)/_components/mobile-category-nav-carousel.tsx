"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CategoryType } from "@prisma/client";
import { customSlugify } from "@/lib/functions";
import { useSearchParams } from "next/navigation";
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
  ariaLabel: string;
};

const categoryOrder = [
  "boilers",
  "radiators",
  "heating",
  "plumbing",
  "bathrooms",
  "kitchens",
  "spares",
  "renewables",
  "tools",
  "electrical",
];

const categoryIcons: Record<
  string,
  { Icon: React.ComponentType<IconProps>; ariaLabel: string }
> = {
  boilers: { Icon: BoilerIcon, ariaLabel: "Browse boiler products" },
  radiators: { Icon: RadiatorIcon, ariaLabel: "Browse radiator products" },
  heating: { Icon: HeatingIcon, ariaLabel: "Browse heating products" },
  plumbing: { Icon: PlumbingIcon, ariaLabel: "Browse plumbing products" },
  bathrooms: { Icon: BathroomIcon, ariaLabel: "Browse bathroom products" },
  kitchens: { Icon: KitchenTilesIcon, ariaLabel: "Browse kitchen products" },
  spares: { Icon: SparesIcon, ariaLabel: "Browse spare parts" },
  renewables: { Icon: RenewablesIcon, ariaLabel: "Browse renewable products" },
  tools: { Icon: ToolsIcon, ariaLabel: "Browse tools" },
  electrical: { Icon: ElectricalIcon, ariaLabel: "Browse electrical products" },
};

function createCategory(category: NavCategory): CategoryWithIcon | null {
  const iconData = categoryIcons[category.name.toLowerCase()];
  if (!iconData) return null;

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
    Icon: iconData.Icon,
    route,
    ariaLabel: iconData.ariaLabel,
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

  const searchParams = useSearchParams();
  const primaryId = searchParams.get("p_id");
  const secondaryId = searchParams.get("s_id");

  const processedCategories = categories
    .map(createCategory)
    .filter((category): category is CategoryWithIcon => category !== null)
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.name.toLowerCase());
      const bIndex = categoryOrder.indexOf(b.name.toLowerCase());
      return aIndex - bIndex;
    });

  const isCategorySelected = (category: CategoryWithIcon) => {
    if (category.type === CategoryType.SECONDARY) {
      return secondaryId === category.id;
    }
    return primaryId === category.id;
  };

  const isParentSelected = (category: CategoryWithIcon) => {
    if (
      category.type === CategoryType.SECONDARY &&
      category.parentPrimaryCategory
    ) {
      return primaryId === category.parentPrimaryCategory.id;
    }
    return false;
  };

  return (
    <nav
      className="pl-4 block lg:hidden"
      aria-label="Mobile category navigation"
    >
      <div
        className="overflow-hidden"
        ref={emblaRef}
        role="region"
        aria-label="Scrollable categories"
        tabIndex={0}
      >
        <ul className="flex" role="list" aria-label="Product categories">
          {processedCategories.map((item) => (
            <li
              key={item.id}
              className="flex-none w-[31%] min-w-[110px] pr-3"
              role="listitem"
            >
              <Link
                href={item.route}
                className={cn(
                  "flex flex-col items-center p-4 w-full",
                  "hover:bg-muted group rounded-xl",
                  "border border-border",
                  "bg-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "transition-colors duration-200",
                  (isCategorySelected(item) || isParentSelected(item)) &&
                    "bg-muted border-primary"
                )}
                aria-label={item.ariaLabel}
                aria-current={isCategorySelected(item) ? "page" : undefined}
              >
                <item.Icon
                  className={cn(
                    "fill-muted-foreground transition-colors duration-200",
                    isCategorySelected(item) || isParentSelected(item)
                      ? "fill-primary"
                      : "",
                    "group-hover:fill-primary"
                  )}
                  height={32}
                  width={32}
                  aria-hidden="true"
                />
                <h5
                  className={cn(
                    "text-xs mt-3 text-center font-semibold uppercase tracking-wide",
                    "text-muted-foreground transition-colors duration-200",
                    (isCategorySelected(item) || isParentSelected(item)) &&
                      "text-primary",
                    "group-hover:text-primary"
                  )}
                >
                  {item.name}
                </h5>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
