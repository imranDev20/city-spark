"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SlidersHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";

type FilterOption = {
  id: string;
  name: string;
  options: string[];
};

interface FilterDrawerProps {
  filterOptions: FilterOption[];
}

export default function FilterDrawer({ filterOptions }: FilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createQueryString, removeQueryString } = useQueryString();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined
  );

  // Find which categories have active filters
  React.useEffect(() => {
    const newSelectedFilters: Record<string, string[]> = {};
    let firstActiveCategory: string | undefined;

    filterOptions.forEach((category) => {
      const param = searchParams.get(category.id);
      if (param) {
        newSelectedFilters[category.id] = param.split(",");
        if (!firstActiveCategory) {
          firstActiveCategory = category.id;
        }
      }
    });

    setSelectedFilters(newSelectedFilters);
    setOpenAccordion(firstActiveCategory);
  }, [searchParams, filterOptions]);

  const handleFilterChange = (categoryId: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentSelection = prev[categoryId] || [];
      const newSelection = currentSelection.includes(option)
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];

      return {
        ...prev,
        [categoryId]: newSelection,
      };
    });
    setOpenAccordion(categoryId);
  };

  const handleApplyFilters = () => {
    let queryString = searchParams.toString();

    Object.entries(selectedFilters).forEach(([categoryId, options]) => {
      if (options.length > 0) {
        queryString = createQueryString({
          [categoryId]: options.join(","),
        });
      } else {
        queryString = removeQueryString(categoryId);
      }
    });

    router.push(queryString ? `?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center gap-2",
            "active:bg-gray-50 transition-colors duration-200"
          )}
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">
            Filter
          </span>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-sm h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Filter Products</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 flex-1 overflow-y-auto">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={openAccordion}
              onValueChange={setOpenAccordion}
            >
              {filterOptions.map((category) => (
                <AccordionItem value={category.id} key={category.id}>
                  <AccordionTrigger>{category.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-3">
                      {category.options.map((option) => (
                        <div
                          key={option}
                          className="flex items-center gap-2"
                          onClick={() =>
                            handleFilterChange(category.id, option)
                          }
                        >
                          <div
                            className={cn(
                              "w-5 h-5 border rounded-md flex items-center justify-center",
                              selectedFilters[category.id]?.includes(option)
                                ? "bg-primary border-primary"
                                : "border-border"
                            )}
                          >
                            {selectedFilters[category.id]?.includes(option) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="p-4 pb-8 mt-auto border-t bg-white">
            <DrawerClose asChild>
              <Button className="w-full" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
