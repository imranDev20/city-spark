import React, { Suspense } from "react";
import { getCategoriesByType } from "../../actions";
import { CategoryType, Prisma } from "@prisma/client";
import StorefrontProductListPage from "../storefront-product-list-page";
import { CategoryWithChildParent } from "@/types/storefront-products";
import PageHeader from "../../../_components/page-header";
import { customSlugify } from "@/lib/functions";
import { cn } from "@/lib/utils";
import MobileCategoryNavCarousel from "../../../_components/mobile-category-nav-carousel";
import Image from "next/image";
import CategoryBanner from "@/images/category-banner.png";
import MobileBottomBar from "../../../_components/mobile-bottom-bar";
import DynamicCategorySidebar from "./dynamic-category-sidebar";
import CategorySidebarSkeleton from "./category-sidebar-skeleton";
import CategoryGridSkeleton from "./category-grid-skeleton";
import DynamicCategoryGrid from "./dynamic-category-grid";

type QuaternaryCategoryWithChilds = Prisma.CategoryGetPayload<{
  include: {
    quaternaryProducts: true;
    parentTertiaryCategory: true;
    parentSecondaryCategory: true;
    parentPrimaryCategory: true;
  };
}>;

export default async function FourthCategoriesPage({
  primaryId,
  secondaryId,
  tertiaryId,
}: {
  primaryId?: string;
  secondaryId?: string;
  tertiaryId?: string;
}) {
  const type: CategoryType = "QUATERNARY";
  const { categories } = await getCategoriesByType(
    type,
    primaryId,
    secondaryId,
    tertiaryId
  );
  const quaternaryCategories = categories as QuaternaryCategoryWithChilds[];

  // Get primary categories for mobile nav carousel
  const { categories: mobileNavCategories } = await getCategoriesByType(
    "PRIMARY",
    ""
  );
  const navCategories = mobileNavCategories as CategoryWithChildParent[];

  if (quaternaryCategories && quaternaryCategories.length === 0) {
    return (
      <StorefrontProductListPage
        isPrimaryRequired
        isSecondaryRequired
        isTertiaryRequired
        primaryCategoryId={primaryId}
        secondaryCategoryId={secondaryId}
        tertiaryCategoryId={tertiaryId}
      />
    );
  }

  const breadcrumbItems = [
    {
      label: "Products",
      href: "/products",
    },
    {
      label: `${quaternaryCategories[0].parentPrimaryCategory?.name}`,
      href: `/products/c/${customSlugify(
        quaternaryCategories[0].parentPrimaryCategory?.name
      )}/c?p_id=${primaryId}`,
    },
    {
      label: `${quaternaryCategories[0].parentSecondaryCategory?.name}`,
      href: `/products/c/${customSlugify(
        quaternaryCategories[0].parentPrimaryCategory?.name
      )}/${customSlugify(
        quaternaryCategories[0].parentSecondaryCategory?.name
      )}/c?p_id=${primaryId}&s_id=${secondaryId}`,
    },
    {
      label: `${quaternaryCategories[0].parentTertiaryCategory?.name}`,
      isCurrentPage: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${quaternaryCategories[0].parentTertiaryCategory?.name}`}
      />

      <section className="mt-5">
        <MobileCategoryNavCarousel categories={navCategories} />
      </section>

      <section
        className={cn(
          "flex-grow mx-auto my-5",
          "container max-w-screen-xl",
          "px-4 md:px-6 lg:px-8"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          {/* Sidebar - hidden on mobile */}

          <Suspense fallback={<CategorySidebarSkeleton />}>
            <DynamicCategorySidebar
              primaryCategoryId={primaryId}
              secondaryCategoryId={secondaryId}
              tertiaryCategoryId={tertiaryId}
            />
          </Suspense>

          {/* Main content - full width on mobile, adjusted columns */}
          <div className="col-span-1 lg:col-span-9">
            <section>
              <Image
                src={CategoryBanner}
                alt="Category Banner"
                className="rounded-lg"
              />
            </section>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr mt-5">
              <Suspense fallback={<CategoryGridSkeleton />}>
                <DynamicCategoryGrid
                  primaryId={primaryId}
                  secondaryId={secondaryId}
                  tertiaryId={tertiaryId}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <MobileBottomBar isShowInProductPage />
    </main>
  );
}
