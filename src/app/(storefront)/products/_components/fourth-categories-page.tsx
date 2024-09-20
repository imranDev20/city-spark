import React from "react";
import { getCategoriesByType } from "../actions";
import { CategoryType, Prisma } from "@prisma/client";
import Link from "next/link";
import { customSlugify } from "@/lib/functions";
import StorefrontProductList from "./storefront-product-list";
import CategoryCard from "./category-card";
import { CategoryWithRelations } from "@/types/storefront-products";
import PageHeader from "../../_components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CategoryLink from "./category-link";

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
    secondaryId
  );

  const quaternaryCategories = categories as QuaternaryCategoryWithChilds[];

  if (quaternaryCategories && quaternaryCategories.length === 0) {
    return (
      <StorefrontProductList
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
    <main>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${quaternaryCategories[0].parentTertiaryCategory?.name}`}
      />

      <section className="mt-10 grid grid-cols-12 gap-4 container max-w-screen-xl">
        <div className="col-span-3">
          <div className="sticky top-20">
            <Card className="shadow-none border-gray-350">
              <CardHeader>
                <CardTitle>
                  {quaternaryCategories[0].parentTertiaryCategory?.name}
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pb-0 overflow-y-auto max-h-[calc(100vh-200px)]">
                {quaternaryCategories.map((category, index) => {
                  return (
                    <React.Fragment key={category.id}>
                      <CategoryLink
                        key={category.id}
                        href={`/products/c/${customSlugify(
                          category.parentPrimaryCategory?.name
                        )}/${customSlugify(
                          category.parentSecondaryCategory?.name
                        )}/${customSlugify(
                          category.parentTertiaryCategory?.name
                        )}/${customSlugify(category.name)}/c?p_id=${
                          category.parentPrimaryCategory?.id
                        }&s_id=${category.parentSecondaryCategory?.id}&t_id=${
                          category.parentTertiaryCategory?.id
                        }&q_id=${category.id}`}
                        name={category.name}
                      />
                      {index !== categories.length - 1 && <Separator />}
                    </React.Fragment>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-9 grid grid-cols-3">
          {quaternaryCategories.map((category) => (
            <div key={category.id}>
              <Link
                href={`/products/c/${customSlugify(
                  category.parentPrimaryCategory?.name
                )}/${customSlugify(
                  category.parentSecondaryCategory?.name
                )}/${customSlugify(
                  category.parentTertiaryCategory?.name
                )}/${customSlugify(
                  category.name
                )}/c?p_id=${primaryId}&s_id=${secondaryId}&t_id=${tertiaryId}&q_id=${
                  category.id
                }`}
              >
                <CategoryCard
                  category={
                    category as CategoryWithRelations //just for stopping type error
                  }
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
