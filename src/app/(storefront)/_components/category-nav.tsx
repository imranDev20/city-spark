"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
import { SVGProps } from "react";
import { BrandsByCategory } from "../products/actions";

type PrimaryCategory = CategoryWithChildParent;
export type SecondaryCategory =
  CategoryWithChildParent["primaryChildCategories"][number];

type CategoryWithParent<T extends PrimaryCategory | SecondaryCategory> = T & {
  Icon: React.FC<SVGProps<SVGSVGElement>>;
  route: string;
  ariaLabel: string;
};

const categoryData: {
  label: string;
  Icon: React.FC<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
}[] = [
  { label: "Boilers", Icon: BoilerIcon, ariaLabel: "Browse boiler products" },
  {
    label: "Radiators",
    Icon: RadiatorIcon,
    ariaLabel: "Browse radiator products",
  },
  { label: "Heating", Icon: HeatingIcon, ariaLabel: "Browse heating products" },
  {
    label: "Plumbing",
    Icon: PlumbingIcon,
    ariaLabel: "Browse plumbing products",
  },
  {
    label: "Bathrooms",
    Icon: BathroomIcon,
    ariaLabel: "Browse bathroom products",
  },
  {
    label: "Kitchens",
    Icon: KitchenTilesIcon,
    ariaLabel: "Browse kitchen products",
  },
  { label: "Spares", Icon: SparesIcon, ariaLabel: "Browse spare parts" },
  {
    label: "Renewables",
    Icon: RenewablesIcon,
    ariaLabel: "Browse renewable products",
  },
  { label: "Tools", Icon: ToolsIcon, ariaLabel: "Browse tools" },
  {
    label: "Electrical",
    Icon: ElectricalIcon,
    ariaLabel: "Browse electrical products",
  },
];

function createMergedCategory<T extends PrimaryCategory | SecondaryCategory>(
  category: T,
  icon: React.FC<SVGProps<SVGSVGElement>>,
  ariaLabel: string
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
    ariaLabel,
  };
}

export default function CategoryNav({
  categories,
  topBrands,
}: {
  categories: CategoryWithChildParent[];
  topBrands: BrandsByCategory;
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const excludedRoutes = [
    "/login/",
    "/register/",
    "/cart/",
    "/checkout/",
    "/basket/",
    "/checkout/result/",
  ];

  // Get the active category from the URL
  const getActiveCategory = () => {
    if (!pathname.startsWith("/products/c/")) return null;

    // Split the path to get category segments
    const segments = pathname.split("/");
    const mainCategory = segments[3]; // First category after /products/c/

    // Special handling for heating/boilers and heating/radiators
    if (mainCategory === "heating") {
      const subCategory = segments[4];
      if (subCategory === "boilers" || subCategory === "radiators") {
        return subCategory.toLowerCase();
      }
    }

    return mainCategory.toLowerCase();
  };

  const activeCategory = getActiveCategory();

  useEffect(() => {
    setHoveredCategory(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  const mergedCategories = categoryData.flatMap((item) => {
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
            createMergedCategory(
              boilers as SecondaryCategory,
              BoilerIcon,
              "Browse boiler products"
            )
          );
        }

        if (radiators) {
          result.push(
            createMergedCategory(
              radiators as SecondaryCategory,
              RadiatorIcon,
              "Browse radiator products"
            )
          );
        }

        result.push(
          createMergedCategory(
            category as PrimaryCategory,
            item.Icon,
            item.ariaLabel
          )
        );

        return result;
      }

      return [
        createMergedCategory(
          category.type === CategoryType.PRIMARY
            ? (category as PrimaryCategory)
            : (category as SecondaryCategory),
          item.Icon,
          item.ariaLabel
        ),
      ];
    }

    return [];
  });

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If there's already a hovered category, transition immediately
    if (hoveredCategory) {
      setHoveredCategory(categoryId);
    } else {
      // Apply delay only for initial hover
      timeoutRef.current = setTimeout(() => {
        setHoveredCategory(categoryId);
      }, 450);
    }
  };
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setHoveredCategory(categoryId === hoveredCategory ? null : categoryId);
        break;
      case "Escape":
        if (hoveredCategory) {
          e.preventDefault();
          setHoveredCategory(null);
        }
        break;
    }
  };

  return (
    <nav
      className="relative bg-white border-b hidden lg:block"
      aria-label="Main product categories"
    >
      <div className="container mx-auto max-w-screen-xl px-0">
        <ul className="flex w-full" role="menubar">
          {mergedCategories.map((item) => {
            const isActive = item.name.toLowerCase() === activeCategory;

            return (
              <li
                key={item.id}
                className={cn(
                  "flex-1 relative group border-r last:border-r-0 border-border",
                  (hoveredCategory === item.id || isActive) && "bg-muted"
                )}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={hoveredCategory === item.id}
                tabIndex={0}
              >
                <Link
                  href={item.route}
                  onClick={() => setHoveredCategory(null)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-3 w-full",
                    "relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm",
                    "hover:bg-muted transition-colors duration-200"
                  )}
                  aria-label={item.ariaLabel}
                >
                  <item.Icon
                    className={cn(
                      "fill-muted-foreground transition-colors duration-200",
                      "group-hover:fill-primary",
                      (hoveredCategory === item.id || isActive) &&
                        "fill-primary"
                    )}
                    height={32}
                    width={32}
                    aria-hidden="true"
                    focusable="false"
                  />
                  <h5
                    className={cn(
                      "text-xs font-semibold text-muted-foreground uppercase tracking-wide transition-colors duration-200",
                      "group-hover:text-primary",
                      (hoveredCategory === item.id || isActive) &&
                        "text-primary"
                    )}
                  >
                    {item.name}
                  </h5>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {hoveredCategory && (
        <MegaMenu
          category={
            mergedCategories.find((c) => c.id === hoveredCategory) ||
            mergedCategories[0]
          }
          topBrands={topBrands}
          onMouseEnter={() => handleMouseEnter(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
          onCloseMenu={() => setHoveredCategory(null)}
        />
      )}
    </nav>
  );
}
