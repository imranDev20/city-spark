"use client";

import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
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

const categoryData = [
  { label: "Boilers", Icon: BoilerIcon },
  { label: "Radiators", Icon: RadiatorIcon },
  { label: "Heating", Icon: HeatingIcon },
  { label: "Plumbing", Icon: PlumbingIcon },
  { label: "Bathrooms, Kitchens & Tiles", Icon: BathroomIcon },
  { label: "Kitchen & Tiles", Icon: KitchenTilesIcon },
  { label: "Spares", Icon: SparesIcon },
  { label: "Renewables", Icon: RenewablesIcon },
  { label: "Tools", Icon: ToolsIcon },
  { label: "Electrical", Icon: ElectricalIcon },
];

type IconProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
};

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

type MergedCategory = Partial<PrimaryCategoryWithChilds> & {
  Icon: React.ComponentType<IconProps>;
  route: string;
  id: string;
  name: string;
};

function createMergedCategory(
  category: Partial<PrimaryCategoryWithChilds>,
  icon: React.ComponentType<IconProps>,
  parentCategory?: PrimaryCategoryWithChilds
): MergedCategory {
  return {
    ...parentCategory,
    ...category,
    Icon: icon,
    route: `/products/c/${customSlugify(category.name || "")}/c?p_id=${
      category.id
    }`,
    primaryChildCategories: category.primaryChildCategories || [],
    id: category.id!,
    name: category.name!,
  } as MergedCategory;
}

export default function CategoryNavComponent({
  categories,
}: {
  categories: PrimaryCategoryWithChilds[];
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const excludedRoutes = ["/login", "/register", "/cart", "/checkout"];

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  const mergedCategories: MergedCategory[] = categoryData.flatMap(
    (item): MergedCategory[] => {
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === item.label.toLowerCase()
      );

      if (category) {
        if (category.name.toLowerCase() === "heating") {
          const result: MergedCategory[] = [];

          const boilers = category.primaryChildCategories.find(
            (subcat) => subcat.name.toLowerCase() === "boilers"
          );
          const radiators = category.primaryChildCategories.find(
            (subcat) => subcat.name.toLowerCase() === "radiators"
          );

          if (boilers) {
            result.push(createMergedCategory(boilers, BoilerIcon, category));
          }

          if (radiators) {
            result.push(
              createMergedCategory(radiators, RadiatorIcon, category)
            );
          }

          result.push(createMergedCategory(category, item.Icon));

          return result;
        }

        return [createMergedCategory(category, item.Icon)];
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
    }, 300);
  };

  return (
    <div className="relative">
      <div className="container mx-auto max-w-screen-xl flex justify-between items-stretch py-0 w-full">
        {mergedCategories.map((item) => (
          <div
            key={item.id}
            className={cn("flex-1 relative px-1")}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={item.route}
              className={cn(
                "flex flex-col justify-center items-center py-4 h-24 cursor-pointer group transition-all w-full",
                (hoveredCategory === item.id || hoveredCategory === item.id) &&
                  "bg-gray-150"
              )}
            >
              <item.Icon
                className="group-hover:fill-primary transition-all flex-shrink-0"
                height={28}
                width={28}
              />
              <h5 className="text-sm mt-1 text-center line-clamp-2 flex-grow flex items-center">
                {item.name}
              </h5>
            </Link>
          </div>
        ))}
      </div>
      {hoveredCategory && (
        <MegaMenu
          category={mergedCategories.find((c) => c.id === hoveredCategory)!}
          onMouseEnter={() => handleMouseEnter(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}
