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
import { cn } from "@/lib/utils";
import MobileBottomBar from "../../_components/mobile-bottom-bar";
import CategoryNav from "../../_components/category-nav";

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

      <section
        className={cn(
          "flex-grow mx-auto my-5 lg:my-10",
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
                            <AccordionTrigger className="font-normal hover:no-underline text-sm lg:text-base">
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

          {/* Main content - full width on mobile, adjusted columns */}
          <div className="col-span-1 lg:col-span-9">
            <h2 className="text-xl font-semibold mb-4 lg:hidden">
              All Categories
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr">
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

      <MobileBottomBar isShowInProductPage />
    </main>
  );
}
