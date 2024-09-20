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

export default async function StorefrontProductList({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
  isPrimaryRequired,
  isSecondaryRequired,
  isTertiaryRequired,
  isQuaternaryRequired,
}: {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
}) {
  const { inventoryItems, hasMore, totalCount } =
    await getInventoryItemsForStorefront({
      primaryCategoryId,
      secondaryCategoryId,
      tertiaryCategoryId,
      quaternaryCategoryId,
      isPrimaryRequired,
      isSecondaryRequired,
      isTertiaryRequired,
      isQuaternaryRequired,
    });

  let primaryCategory, secondaryCategory, tertiaryCategory, quaternaryCategory;

  if (inventoryItems.length > 0) {
    ({
      product: {
        primaryCategory,
        secondaryCategory,
        tertiaryCategory,
        quaternaryCategory,
      },
    } = inventoryItems[0]);
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", href: "/products" },
    ...(isPrimaryRequired && primaryCategory?.name
      ? [
          {
            label: primaryCategory.name,
            ...(isSecondaryRequired ||
            isTertiaryRequired ||
            isQuaternaryRequired
              ? {
                  href: `/products/c/${customSlugify(
                    primaryCategory.name
                  )}/c?p_id=${primaryCategory.id}`,
                }
              : { isCurrentPage: true }),
          },
        ]
      : []),
    ...(isSecondaryRequired && secondaryCategory?.name
      ? [
          {
            label: secondaryCategory.name,
            ...(isTertiaryRequired || isQuaternaryRequired
              ? {
                  href: `/products/c/${customSlugify(
                    primaryCategory?.name
                  )}/${customSlugify(secondaryCategory.name)}/c?p_id=${
                    primaryCategory?.id
                  }&s_id=${secondaryCategory.id}`,
                }
              : { isCurrentPage: true }),
          },
        ]
      : []),
    ...(isTertiaryRequired && tertiaryCategory?.name
      ? [
          {
            label: tertiaryCategory.name,
            ...(isQuaternaryRequired
              ? {
                  href: `/products/c/${customSlugify(
                    primaryCategory?.name
                  )}/${customSlugify(secondaryCategory?.name)}/${customSlugify(
                    tertiaryCategory.name
                  )}/c?p_id=${primaryCategory?.id}&s_id=${
                    secondaryCategory?.id
                  }&t_id=${tertiaryCategory.id}`,
                }
              : { isCurrentPage: true }),
          },
        ]
      : []),
    ...(isQuaternaryRequired && quaternaryCategory?.name
      ? [
          {
            label: quaternaryCategory.name,
            isCurrentPage: true,
          },
        ]
      : []),
  ].filter((item): item is BreadcrumbItem => item !== null);

  return (
    <main>
      <PageHeader breadcrumbItems={breadcrumbItems} title="Products" />

      <section className="container max-w-screen-xl mx-auto grid grid-cols-12 gap-8 mt-10">
        <div className="col-span-3">
          <FilterSidebar />
        </div>
        <div className="col-span-9">
          <Image
            src={BannerImage}
            alt=""
            className="w-full h-auto mb-6 rounded-xl"
          />

          <div className="flex justify-between items-center mb-6">
            <p className="text-base text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
              {totalCount === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center">
              <label
                htmlFor="sort-select"
                className="text-sm text-gray-600 mr-2"
              >
                Sort by:
              </label>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
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

          <div>
            {inventoryItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {inventoryItems.map((item) => (
                  <ProductCard key={item.id} inventoryItem={item} />
                ))}
              </div>
            ) : (
              <Card className="w-full h-64 flex items-center justify-center shadow-none border-0">
                <CardContent className="text-center">
                  <PackageX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500">
                    We couldn&apos;t find any products matching your criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
