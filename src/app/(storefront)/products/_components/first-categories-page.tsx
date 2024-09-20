import React from "react";
import { getCategoriesByType } from "../actions";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import CategoryCard from "./category-card";
import { CategoryWithRelations } from "@/types/storefront-products";
import PageHeader from "../../_components/page-header";
import { customSlugify } from "@/lib/functions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CategoryLink from "./category-link";

type PrimaryCagoryWithChilds = Prisma.CategoryGetPayload<{
  include: {
    primaryChildCategories: true;
    primaryProducts: true;
  };
}>;

const bredcrumbItems = [
  {
    label: "Products",
    isCurrentPage: true,
  },
];

export default async function FirstCategoriesPage() {
  const type = "PRIMARY";
  const { categories } = await getCategoriesByType(type, "");
  const primaryCategories = categories as PrimaryCagoryWithChilds[];

  return (
    <main className="min-h-screen flex flex-col">
      <PageHeader breadcrumbItems={bredcrumbItems} title="Products" />

      <section className="flex-grow mt-10 container max-w-screen-xl">
        <div className="grid grid-cols-12 gap-4 h-full">
          <aside className="col-span-3">
            <div className="sticky top-20">
              <Card className="shadow-none border-gray-350">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pb-0 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {primaryCategories.map((category, index) => {
                    if (category.primaryChildCategories.length > 0) {
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
                                {category.primaryChildCategories.map(
                                  (subcategory) => (
                                    <CategoryLink
                                      key={subcategory.id}
                                      href={`/products/c/${customSlugify(
                                        category.name
                                      )}/${customSlugify(
                                        subcategory.name
                                      )}/c?p_id=${category.id}&s_id=${
                                        subcategory.id
                                      }`}
                                      name={subcategory.name}
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
                              category.name
                            )}/c?p_id=${category.id}`}
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

          <div className="col-span-9">
            <div className="grid grid-cols-3 gap-4 auto-rows-fr">
              {categories.map((category) => (
                <div key={category.id} className="h-full">
                  <Link
                    href={`/products/c/${customSlugify(category.name)}/c?p_id=${
                      category.id
                    }`}
                    className="h-full block"
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
          </div>
        </div>
      </section>
    </main>
  );
}
