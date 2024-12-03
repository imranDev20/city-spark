import React from "react";
import ProductCard from "../../_components/product-card";
import { getInventoryItemsForStorefront } from "../../actions";
import { Card, CardContent } from "@/components/ui/card";
import { PackageX } from "lucide-react";
import PageHeader from "../../_components/page-header";
import FilterSidebar from "./filter-sidebar";
import Image from "next/image";
import BannerImage from "@/images/banners.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BreadcrumbItem } from "@/types/misc";
import { customSlugify } from "@/lib/functions";
import { CategoryType } from "@prisma/client";
import {
  getBrands,
  getCategoryById,
  getProductFilterOptions,
} from "../actions";
import { cn } from "@/lib/utils";
import ProductActionBar from "./product-action-bar";

export default async function StorefrontProductListPage({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
  isPrimaryRequired,
  isSecondaryRequired,
  isTertiaryRequired,
  isQuaternaryRequired,
  isSearch,
  search,
}: {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
}) {
  let currentCategory;

  if (isQuaternaryRequired && quaternaryCategoryId) {
    currentCategory = await getCategoryById(quaternaryCategoryId);
  } else if (isTertiaryRequired && tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
  } else if (isSecondaryRequired && secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
  } else if (isPrimaryRequired && primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
  }

  const { inventoryItems, totalCount } = await getInventoryItemsForStorefront({
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
    isPrimaryRequired,
    isSecondaryRequired,
    isTertiaryRequired,
    isQuaternaryRequired,
    search: isSearch ? search : undefined,
  });

  const filterOptions = await getProductFilterOptions();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", href: "/products" },
  ];

  const brands = await getBrands();

  if (isSearch) {
    breadcrumbItems.push({ label: "Search", isCurrentPage: true });
  } else {
    if (isQuaternaryRequired && quaternaryCategoryId) {
      currentCategory = await getCategoryById(quaternaryCategoryId);
    } else if (isTertiaryRequired && tertiaryCategoryId) {
      currentCategory = await getCategoryById(tertiaryCategoryId);
    } else if (isSecondaryRequired && secondaryCategoryId) {
      currentCategory = await getCategoryById(secondaryCategoryId);
    } else if (isPrimaryRequired && primaryCategoryId) {
      currentCategory = await getCategoryById(primaryCategoryId);
    }

    if (currentCategory) {
      if (currentCategory.type === CategoryType.QUATERNARY) {
        breadcrumbItems.push(
          {
            label: currentCategory.parentPrimaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}`,
          },
          {
            label: currentCategory.parentSecondaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentSecondaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}&s_id=${
              currentCategory.parentSecondaryCategory!.id
            }`,
          },
          {
            label: currentCategory.parentTertiaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentSecondaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentTertiaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}&s_id=${
              currentCategory.parentSecondaryCategory!.id
            }&t_id=${currentCategory.parentTertiaryCategory!.id}`,
          }
        );
      } else if (currentCategory.type === CategoryType.TERTIARY) {
        breadcrumbItems.push(
          {
            label: currentCategory.parentPrimaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}`,
          },
          {
            label: currentCategory.parentSecondaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentSecondaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}&s_id=${
              currentCategory.parentSecondaryCategory!.id
            }`,
          }
        );
      } else if (currentCategory.type === CategoryType.SECONDARY) {
        breadcrumbItems.push({
          label: currentCategory.parentPrimaryCategory!.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory!.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}`,
        });
      }

      breadcrumbItems.push({
        label: currentCategory.name,
        isCurrentPage: true,
      });
    }
  }

  return (
    <main>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={
          isSearch
            ? `Search Results for "${search}"`
            : currentCategory?.name || "Products"
        }
      />

      <section
        className={cn(
          "flex-grow mx-auto my-5",
          "container max-w-screen-xl",
          "px-4 md:px-6 lg:px-8"
        )}
      >
        <div className="grid grid-cols-12 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block col-span-3">
            <FilterSidebar
              initialBrands={brands}
              filterOptions={filterOptions}
            />
          </div>

          <div className="col-span-12 md:col-span-9">
            <h2 className="text-2xl font-semibold lg:hidden">
              {currentCategory?.name}
            </h2>
            <p className="mb-4 text-muted-foreground block lg:hidden">
              {totalCount} Products
            </p>

            <Image
              src={BannerImage}
              alt=""
              className="w-full h-auto rounded-lg"
            />

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <p className="text-base text-gray-600 hidden lg:block">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {totalCount}
                </span>{" "}
                {totalCount === 1 ? "product" : "products"}
              </p>

              <div className="items-center gap-2 hidden lg:flex">
                <div className="flex items-center">
                  <label
                    htmlFor="sort-select"
                    className="text-sm text-gray-600 mr-2 hidden sm:inline"
                  >
                    Sort by:
                  </label>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[140px] sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low-to-high">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high-to-low">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="bestselling">Best Selling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              {inventoryItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {inventoryItems.map((item) => (
                    <ProductCard key={item.id} inventoryItem={item} />
                  ))}
                </div>
              ) : (
                <Card className="w-full h-64 flex items-center justify-center shadow-none border-0">
                  <CardContent className="text-center">
                    <PackageX className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-xl font-semibold text-gray-900">
                      No products found
                    </p>
                    <p className="text-gray-600">
                      Try adjusting your search or filter to find what
                      you&apos;re looking for.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductActionBar />
    </main>
  );
}
