import React from "react";
import { getCategoriesByType } from "../actions";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import StorefrontProductList from "./storefront-product-list";
import CategoryCard from "./category-card";
import { CategoryWithRelations } from "@/types/storefront-products";
import PageHeader from "../../_components/page-header";
import { customSlugify } from "@/lib/functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryLink from "./category-link";

type SecondaryCagoryWithChilds = Prisma.CategoryGetPayload<{
  include: {
    secondaryChildCategories: true;
    parentPrimaryCategory: true;
    secondaryProducts: true;
  };
}>;

export default async function SecondCategoriesPage({
  primaryId,
}: {
  primaryId?: string;
}) {
  const type = "SECONDARY";
  const { categories } = await getCategoriesByType(type, primaryId || "");
  const secondaryCategories = categories as SecondaryCagoryWithChilds[];

  if (secondaryCategories.length === 0) {
    return (
      <StorefrontProductList primaryCategoryId={primaryId} isPrimaryRequired />
    );
  }

  const breadcrumbItems = [
    {
      label: "Products",
      href: "/products",
    },
    {
      label: `${secondaryCategories[0].parentPrimaryCategory?.name}`,
      isCurrentPage: true,
    },
  ];

  return (
    <main>
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${secondaryCategories[0].parentPrimaryCategory?.name}`}
      />

      <section className="mt-10 grid grid-cols-12 gap-4 container max-w-screen-xl">
        <div className="col-span-3">
          <div className="sticky top-20">
            <Card className="shadow-none border-gray-350">
              <CardHeader>
                <CardTitle>
                  {secondaryCategories[0].parentPrimaryCategory?.name}
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pb-0 overflow-y-auto max-h-[calc(100vh-200px)]">
                {secondaryCategories.map((category, index) => {
                  if (category.secondaryChildCategories.length > 0) {
                    return (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        key={category.id}
                      >
                        <AccordionItem value={`category-${category.id}`}>
                          <AccordionTrigger className="font-normal hover:no-underline">
                            {category.name}
                          </AccordionTrigger>
                          <AccordionContent className="py-0">
                            <Separator />
                            <ul className="pl-3">
                              {category.secondaryChildCategories.map(
                                (subcategory) => (
                                  <CategoryLink
                                    name={subcategory.name}
                                    key={subcategory.id}
                                    href={`/products/c/${customSlugify(
                                      category.parentPrimaryCategory?.name
                                    )}/${customSlugify(
                                      category.name
                                    )}/${customSlugify(
                                      subcategory.name
                                    )}/c?p_id=${
                                      category.parentPrimaryCategory?.id
                                    }&s_id=${category.id}&t_id=${
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
                          )}/${customSlugify(category.name)}/c?p_id=${
                            category.parentPrimaryCategory?.id
                          }&s_id=${category.id}`}
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
        </div>

        <div className="col-span-9 grid grid-cols-3 gap-4">
          {secondaryCategories.map((category) => (
            <div key={category.id}>
              <Link
                href={`/products/c/${customSlugify(
                  category.parentPrimaryCategory?.name
                )}/${customSlugify(category.name)}/c?p_id=${primaryId}&s_id=${
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
