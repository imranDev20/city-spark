import React, { Suspense } from "react";
import { getCategoriesByType } from "../../actions";
import { CategoryType } from "@prisma/client";
import StorefrontProductListPage from "../storefront-product-list-page";
import { CategoryWithChildParent } from "@/types/storefront-products";
import { cn } from "@/lib/utils";
import Image from "next/image";
import CategoryBanner from "@/images/category-banner.png";
import MobileBottomBar from "../../../_components/mobile-bottom-bar";
import DynamicCategorySidebar from "./dynamic-category-sidebar";
import CategorySidebarSkeleton from "./category-sidebar-skeleton";
import CategoryGridSkeleton from "./category-grid-skeleton";
import DynamicCategoryGrid from "./dynamic-category-grid";
import DynamicPageHeader from "./dynamic-category-page-header";
import PageHeaderSkeleton from "../product-list/page-header-skeleton";
import MobileCategoryNavCarousel from "@/app/(storefront)/_components/mobile-category-nav-carousel";
import { delay } from "@/lib/server-utils";
import MobileHeader from "@/app/(storefront)/_components/mobile-header";

interface DynamicCategoryPageProps {
  type?: CategoryType;
  primaryId?: string;
  secondaryId?: string;
  tertiaryId?: string;
}

export default async function DynamicCategoryPage({
  type = "PRIMARY",
  primaryId,
  secondaryId,
  tertiaryId,
}: DynamicCategoryPageProps) {
  // Fetch categories based on the type and IDs
  const { categories } = await getCategoriesByType(
    type,
    primaryId || "",
    secondaryId,
    tertiaryId
  );

  // Get primary categories for mobile nav (needed for all pages)
  const { categories: mobileNavCategories } = await getCategoriesByType(
    "PRIMARY",
    ""
  );
  const navCategories = mobileNavCategories as CategoryWithChildParent[];

  // If no categories found, fall back to product list page
  if (categories.length === 0) {
    const props = {
      primaryCategoryId: primaryId,
      secondaryCategoryId: secondaryId,
      tertiaryCategoryId: tertiaryId,
      isPrimaryRequired: !!primaryId,
      isSecondaryRequired: !!secondaryId,
      isTertiaryRequired: !!tertiaryId,
    };

    return <StorefrontProductListPage {...props} />;
  }

  return (
    <>
      <MobileHeader isCategoriesPage />
      <main className="min-h-screen flex flex-col">
        <Suspense fallback={<PageHeaderSkeleton />}>
          <DynamicPageHeader
            primaryCategoryId={primaryId}
            secondaryCategoryId={secondaryId}
            tertiaryCategoryId={tertiaryId}
          />
        </Suspense>

        {type !== "PRIMARY" && (
          <section className="mt-5 block lg:hidden">
            <MobileCategoryNavCarousel categories={navCategories} />
          </section>
        )}

        <section
          className={cn(
            "flex-grow mx-auto my-5 lg:my-10",
            "container max-w-screen-xl",
            "px-4 md:px-6 lg:px-8"
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 h-full">
            <Suspense fallback={<CategorySidebarSkeleton />}>
              <DynamicCategorySidebar
                primaryCategoryId={primaryId}
                secondaryCategoryId={secondaryId}
                tertiaryCategoryId={tertiaryId}
              />
            </Suspense>

            <div className="col-span-1 lg:col-span-9">
              {type !== "PRIMARY" && (
                <section>
                  <Image
                    src={CategoryBanner}
                    alt="Category Banner"
                    className="rounded-lg"
                    placeholder="blur"
                  />
                </section>
              )}
              <Suspense fallback={<CategoryGridSkeleton />}>
                <div className="lg:hidden">
                  <h1 className="my-5 font-semibold text-2xl">
                    {type === "PRIMARY" ? "All Categories" : ""}
                  </h1>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr",
                    type !== "PRIMARY" ? "lg:mt-5" : ""
                  )}
                >
                  <DynamicCategoryGrid
                    primaryId={primaryId}
                    secondaryId={secondaryId}
                    tertiaryId={tertiaryId}
                  />
                </div>
              </Suspense>
            </div>
          </div>
        </section>

        <MobileBottomBar isShowInProductPage />
      </main>
    </>
  );
}
