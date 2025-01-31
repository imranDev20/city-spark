"use client";

import React, { useRef, useEffect } from "react";
import { Search, X, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FilterDrawer from "./filter-drawer";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import SearchSuggestions from "./search-suggestions";
import {
  BrandWithCount,
  CategoryWithCount,
  fetchSuggestions,
  InventoryWithProduct,
} from "@/services/suggestions";
import { useForm, Controller } from "react-hook-form";
import { useSearchStore } from "@/hooks/use-search-store";

type FormData = {
  searchTerm: string;
};

interface SearchOverlayProps {
  showInitialSearch?: boolean;
}

export default function SearchOverlay({
  showInitialSearch = true,
}: SearchOverlayProps) {
  const {
    isOpen,
    recentSearches,
    setIsOpen,
    addRecentSearch,
    clearHistory,
    loadRecentSearches,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, watch, setValue, resetField } =
    useForm<FormData>({
      defaultValues: {
        searchTerm: "",
      },
    });

  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchSuggestions", debouncedSearchTerm],
    queryFn: () => fetchSuggestions(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
      loadRecentSearches();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loadRecentSearches]);

  const handleBrandSelect = (brand: BrandWithCount) => {
    setIsOpen(false);
    router.push(`/brands/${encodeURIComponent(brand.name.toLowerCase())}`);
  };

  const handleCategorySelect = (category: CategoryWithCount) => {
    setIsOpen(false);
    router.push(
      `/categories/${encodeURIComponent(category.name.toLowerCase())}`
    );
  };

  const handleProductSelect = (product: InventoryWithProduct) => {
    setValue("searchTerm", product.product.name);
    setIsOpen(false);
    router.push(`/products/p/${product.product.name}/p/${product.id}`);
  };

  const onSubmit = (data: FormData) => {
    if (data.searchTerm.trim()) {
      addRecentSearch(data.searchTerm.trim());
      router.push(
        `/products?search=${encodeURIComponent(data.searchTerm.trim())}`
      );
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resetField("searchTerm");
  };

  return (
    <>
      {/* Search Input Trigger */}
      {showInitialSearch && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Search for products"
            className="w-full pl-12 pr-12 h-12 rounded-full border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            onFocus={() => setIsOpen(true)}
            readOnly
          />
          <FilterDrawer />
        </div>
      )}

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="h-16 flex items-center gap-3">
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex-1"
              >
                <Controller
                  name="searchTerm"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        {...field}
                        ref={inputRef}
                        placeholder="Search for products"
                        className="w-full pl-12 pr-12 h-12 rounded-full border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        autoComplete="off"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => resetField("searchTerm")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  )}
                />
              </form>
            </div>

            {/* Search Content */}
            <div className="mt-2" ref={searchContainerRef}>
              {searchTerm ? (
                // Search Results
                searchResults && (
                  <SearchSuggestions
                    brands={searchResults.brands}
                    categories={searchResults.categories}
                    products={searchResults.products}
                    onSelectBrand={handleBrandSelect}
                    onSelectCategory={handleCategorySelect}
                    onSelectProduct={handleProductSelect}
                  />
                )
              ) : recentSearches.length > 0 ? (
                // Recent Searches
                <div className="py-2">
                  <div className="px-4 flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Recent Searches
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      Clear History
                    </Button>
                  </div>
                  {recentSearches.map((search) => (
                    <div key={search.timestamp}>
                      <div
                        onClick={() => {
                          setValue("searchTerm", search.term);
                          handleSubmit(onSubmit)();
                        }}
                        className="py-3 px-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {search.term}
                          </h3>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <Separator className="bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
