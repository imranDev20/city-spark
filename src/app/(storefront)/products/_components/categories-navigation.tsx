"use client";
import { CaretRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { NavigationType } from "./categories-page";

export default function CategoriesNavigation({ navigationList }: { navigationList: NavigationType }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);
  const [openTertiaryCategory, setOpenTertiaryCategory] = useState<string | null>(null);

  const handleToggleCategory = (categoryId: string | null) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
    setOpenSubCategory(null); // Close subcategories when a new category is toggled
    setOpenTertiaryCategory(null); // Close tertiary categories when a new category is toggled
  };

  const handleToggleSubCategory = (subCategoryId: string | null) => {
    setOpenSubCategory((prev) => (prev === subCategoryId ? null : subCategoryId));
    setOpenTertiaryCategory(null); // Close tertiary categories when a new subcategory is toggled
  };

  const handleToggleTertiaryCategory = (tertiaryCategoryId: string | null) => {
    setOpenTertiaryCategory((prev) => (prev === tertiaryCategoryId ? null : tertiaryCategoryId));
  };

  return (
    <>
    <div className="lg:w-[332px] lg:h-5/6  mt-6 ms-7 bg-white rounded-lg border">
      <h2 className="font-semibold text-[18px] ps-4 py-[18px]">Categories</h2>
      <Separator />

      <ul>
        {navigationList.map((primary, index) => (
          <li key={primary.id}>
            <div className="flex justify-between items-center ps ">
              <Link href={`/products/${primary.name.trim().toLowerCase().split(" ").join("-")}`}>
                <p
                  className={`${openCategory === primary.id ? 'font-semibold' : 'font-normal'} text-[16px] py-3 ps-6 cursor-pointer`}
                >
                  {primary.name}
                </p>
              </Link>
              {primary.primaryChildCategories.length > 0 && (
                <div
                  onClick={() => handleToggleCategory(primary.id)}
                  className="cursor-pointer"
                >
                  {openCategory === primary.id ? (
                    <ChevronDownIcon className="w-4 h-4 text-gray-700" />
                  ) : (
                    <CaretRightIcon className="w-4 h-4 text-gray-700" />
                  )}
                </div>
              )}
            </div>

            {openCategory === primary.id && (
              <ul className="ml-5 mt-2 space-y-3">
                {primary.primaryChildCategories.map((secondary) => (
                  <li key={secondary.id}>
                    <div className="flex justify-between items-center">
                      <Link href={`/products/${primary.name.toLowerCase().split(" ").join("-")}/${secondary.name.trim().toLowerCase().split(" ").join("-")}`}>
                        <p
                          className={`${openSubCategory === secondary.id ? 'font-semibold' : 'font-normal'} text-[16px] ps-8 py-3 cursor-pointer`}
                        >
                          {secondary.name}
                        </p>
                      </Link>
                      {secondary.secondaryChildCategories.length > 0 && (
                        <div
                          onClick={() => handleToggleSubCategory(secondary.id)}
                          className="cursor-pointer"
                        >
                          {openSubCategory === secondary.id ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-700" />
                          ) : (
                            <CaretRightIcon className="w-4 h-4 text-gray-700" />
                          )}
                        </div>
                      )}
                    </div>

                    {openSubCategory === secondary.id && (
                      <ul className="ml-5 mt-2 space-y-3">
                        {secondary.secondaryChildCategories.map((tertiary) => (
                          <li key={tertiary.id}>
                            <div className="flex justify-between items-center">
                              <Link href={`/products/${primary.name.toLowerCase().split(" ").join("-")}/${secondary.name.trim().toLowerCase().split(" ").join("-")}/${tertiary.name.trim().toLowerCase().split(" ").join("-")}`}>
                                <p className={`${openTertiaryCategory === tertiary.id ? 'font-semibold' : 'font-normal'} text-[16px] ps-10 py-3 cursor-pointer`}>
                                  {tertiary.name}
                                </p>
                              </Link>
                              {tertiary.tertiaryChildCategories.length > 0 && (
                                <div
                                  onClick={() => handleToggleTertiaryCategory(tertiary.id)}
                                  className="cursor-pointer"
                                >
                                  {openTertiaryCategory === tertiary.id ? (
                                    <ChevronDownIcon className="w-4 h-4 text-gray-700" />
                                  ) : (
                                    <CaretRightIcon className="w-4 h-4 text-gray-700" />
                                  )}
                                </div>
                              )}
                            </div>

                            {openTertiaryCategory === tertiary.id && (
                              <ul className="ml-5 mt-2 space-y-3">
                                {tertiary.tertiaryChildCategories.map((quaternary) => (
                                  <li key={quaternary.id}>
                                    <Link href={`/products/${primary.name.toLowerCase().split(" ").join("-")}/${secondary.name.trim().toLowerCase().split(" ").join("-")}/${tertiary.name.trim().toLowerCase().split(" ").join("-")}/${quaternary.name.trim().toLowerCase().split(" ").join("-")}`}>
                                      <p className="font-normal text-[16px] ps-12 py-3 cursor-pointer">
                                        {quaternary.name}
                                      </p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {index < navigationList.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
