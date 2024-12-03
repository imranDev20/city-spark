import React from "react";
import { getCategoriesByType } from "../actions";
import { CategoryType, Prisma } from "@prisma/client";
import Link from "next/link";
import StorefrontProductListPage from "./storefront-product-list-page";
import CategoryCard from "./category-card";
import {
  CategoryWithChildParent,
  CategoryWithRelations,
} from "@/types/storefront-products";
import PageHeader from "../../_components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryLink from "./category-link";
import { customSlugify } from "@/lib/functions";
import { cn } from "@/lib/utils";
import MobileCategoryNavCarousel from "../../_components/mobile-category-nav-carousel";
import Image from "next/image";
import CategoryBanner from "@/images/category-banner.png";
import MobileBottomBar from "../../_components/mobile-bottom-bar";
import CategoryNav from "../../_components/category-nav";

type TertiaryCategoryWithChilds = Prisma.CategoryGetPayload<{
  include: {
    tertiaryChildCategories: true;
    parentSecondaryCategory: true;
    parentPrimaryCategory: true;
    tertiaryProducts: true;
  };
}>;

export default async function ThirdCategoriesPage({
  primaryId,
  secondaryId,
}: {
  primaryId?: string;
  secondaryId?: string;
}) {
  const type: CategoryType = "TERTIARY";
  const { categories } = await getCategoriesByType(
    type,
    primaryId,
    secondaryId
  );
  const tertiaryCategories = categories as TertiaryCategoryWithChilds[];

  // Get primary categories for mobile nav carousel
  const { categories: mobileNavCategories } = await getCategoriesByType(
    "PRIMARY",
    ""
  );
  const navCategories = mobileNavCategories as CategoryWithChildParent[];

  if (tertiaryCategories.length === 0) {
    return (
      <StorefrontProductListPage
        isPrimaryRequired
        isSecondaryRequired
        primaryCategoryId={primaryId}
        secondaryCategoryId={secondaryId}
      />
    );
  }

  const breadcrumbItems = [
    {
      label: "Products",
      href: "/products",
    },
    {
      label: `${tertiaryCategories[0].parentPrimaryCategory?.name}`,
      href: `/products/c/${customSlugify(
        tertiaryCategories[0].parentPrimaryCategory?.name
      )}/c?p_id=${primaryId}`,
    },
    {
      label: `${tertiaryCategories[0].parentSecondaryCategory?.name}`,
      isCurrentPage: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${tertiaryCategories[0].parentSecondaryCategory?.name}`}
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
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <Card className="border-gray-300 rounded-xl overflow-hidden hover:shadow-sm transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle>
                    {tertiaryCategories[0].parentSecondaryCategory?.name}
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pb-0 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {tertiaryCategories.map((category, index) => {
                    if (category.tertiaryChildCategories.length > 0) {
                      return (
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          key={category.id}
                        >
                          <AccordionItem value={`category-${category.id}`}>
                            <AccordionTrigger className="font-normal hover:no-underline text-sm lg:text-base">
                              {category.name}
                            </AccordionTrigger>
                            <AccordionContent className="py-0">
                              <Separator />
                              <ul className="pl-3">
                                {category.tertiaryChildCategories.map(
                                  (subcategory) => (
                                    <CategoryLink
                                      name={subcategory.name}
                                      key={subcategory.id}
                                      href={`/products/c/${customSlugify(
                                        category.parentPrimaryCategory?.name
                                      )}/${customSlugify(
                                        category.parentSecondaryCategory?.name
                                      )}/${customSlugify(
                                        category.name
                                      )}/${customSlugify(
                                        subcategory.name
                                      )}/c?p_id=${
                                        category.parentPrimaryCategory?.id
                                      }&s_id=${
                                        category.parentSecondaryCategory?.id
                                      }&t_id=${category.id}&q_id=${
                                        subcategory.id
                                      }`}
                                    />
                                  )
                                )}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    } else {
                      return (
                        <React.Fragment key={category.id}>
                          <CategoryLink
                            key={category.id}
                            href={`/products/c/${customSlugify(
                              category.parentPrimaryCategory?.name
                            )}/${customSlugify(
                              category.parentSecondaryCategory?.name
                            )}/${customSlugify(category.name)}/c?p_id=${
                              category.parentPrimaryCategory?.id
                            }&s_id=${
                              category.parentSecondaryCategory?.id
                            }&t_id=${category.id}`}
                            name={category.name}
                          />
                          {index !== categories.length - 1 && <Separator />}
                        </React.Fragment>
                      );
                    }
                  })}
                </CardContent>
              </Card>
            </div>
          </aside>

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
              {tertiaryCategories.map((category) => (
                <div key={category.id} className="h-full">
                  <Link
                    href={`/products/c/${customSlugify(
                      category.parentPrimaryCategory?.name
                    )}/${customSlugify(
                      category.parentSecondaryCategory?.name
                    )}/${customSlugify(
                      category.name
                    )}/c?p_id=${primaryId}&s_id=${secondaryId}&t_id=${
                      category.id
                    }`}
                    className="h-full block"
                  >
                    <CategoryCard
                      category={category as CategoryWithRelations}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MobileBottomBar isShowInProductPage />
    </main>
  );
}
