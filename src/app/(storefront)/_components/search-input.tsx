"use client";

import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import SearchSuggestions from "./search-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrandWithCount,
  CategoryWithCount,
  fetchSuggestions,
  InventoryWithProduct,
} from "@/services/suggestions";

type FormData = {
  searchTerm: string;
};

const messages = [
  "boilers",
  "heaters",
  "bathroom & kitchen tiles",
  "plumbing tools and items",
  "spares",
  "renewables",
  "electrical & lighting items",
  "clearance",
];

type RecentSearch = {
  term: string;
  timestamp: number;
};

export default function SearchInput() {
  const [placeholder, setPlaceholder] = useState("Search for products");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTypingEffect, setIsTypingEffect] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const { control, handleSubmit, watch, setValue, resetField } =
    useForm<FormData>({
      defaultValues: {
        searchTerm: "",
      },
    });

  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const pathname = usePathname();

  // Add this effect
  useEffect(() => {
    setShowSuggestions(false);
    setIsFocused(false);
  }, [pathname]);

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
    if (!isTypingEffect) return;

    const currentMessage = messages[messageIndex];
    let typingSpeed = 100;

    if (isDeleting) {
      typingSpeed /= 2;
    }

    const handleTyping = () => {
      if (!isDeleting && index < currentMessage.length) {
        setPlaceholder("Search for " + currentMessage.substring(0, index + 1));
        setIndex(index + 1);
      } else if (isDeleting && index > 0) {
        setPlaceholder("Search for " + currentMessage.substring(0, index - 1));
        setIndex(index - 1);
      } else if (!isDeleting && index === currentMessage.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    };

    const timeoutId = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [index, isDeleting, messageIndex, isTypingEffect]);

  useEffect(() => {
    const searches = localStorage.getItem("recentSearches");
    if (searches) {
      setRecentSearches(JSON.parse(searches));
    }
  }, []);

  useEffect(() => {
    setShowSuggestions(
      isFocused &&
        !!debouncedSearchTerm.trim() &&
        !isLoading &&
        !isError &&
        !!(
          searchResults?.brands.length ||
          searchResults?.categories.length ||
          searchResults?.products.length
        )
    );
  }, [debouncedSearchTerm, isLoading, isError, isFocused, searchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Add/remove body scroll lock when overlay is shown
    if (isFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFocused]);

  const addRecentSearch = (term: string) => {
    const newSearch = { term, timestamp: Date.now() };
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((s) => s.term !== term),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const onSubmit = (data: FormData) => {
    if (data.searchTerm.trim()) {
      addRecentSearch(data.searchTerm.trim());
      router.push(
        `/products?search=${encodeURIComponent(data.searchTerm.trim())}`
      );
      setShowSuggestions(false);
    }
  };

  const handleBrandSelect = (brand: BrandWithCount) => {
    setShowSuggestions(false);
    router.push(`/brands/${encodeURIComponent(brand.name.toLowerCase())}`);
  };

  const handleCategorySelect = (category: CategoryWithCount) => {
    setShowSuggestions(false);
    router.push(
      `/categories/${encodeURIComponent(category.name.toLowerCase())}`
    );
  };

  const handleProductSelect = (product: InventoryWithProduct) => {
    setValue("searchTerm", product.product.name);
    setShowSuggestions(false);
    router.push(`/products/p/${product.product.name}/p/${product.id}`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsTypingEffect(false);
    setPlaceholder("Search for products");
  };

  const handleClear = () => {
    resetField("searchTerm");
    setShowSuggestions(false);
  };

  return (
    <>
      {isFocused && (
        <div
          className="fixed inset-0 bg-black/40 transition-opacity duration-200"
          onClick={() => setIsFocused(false)}
          style={{ zIndex: 55 }}
        />
      )}

      <div
        ref={searchContainerRef}
        className="flex-1 relative max-w-2xl mx-auto"
        style={{ zIndex: 101 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <div
            className={cn(
              "flex h-12 items-center bg-white rounded-md border border-primary shadow-sm transition-all duration-200",
              "hover:border-secondary hover:shadow-md",
              isFocused && "border-secondary shadow-md ring-1 ring-secondary/20"
            )}
          >
            <div className="px-4 text-primary border-r">
              <Search className="h-5 w-5" />
            </div>

            <Controller
              name="searchTerm"
              control={control}
              render={({ field }) => (
                <div className="relative flex-1">
                  <input
                    {...field}
                    className="h-full border-0 bg-transparent px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 w-full py-2 outline-none"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-sm hover:bg-secondary/10 text-muted-foreground/60"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            />

            <Button
              type="submit"
              variant="secondary"
              className={cn(
                "h-12 px-6 rounded-none rounded-r-md",
                "transition-all duration-200 hover:opacity-90"
              )}
            >
              Search
            </Button>
          </div>
        </form>

        {((!searchTerm && recentSearches.length > 0) ||
          (showSuggestions && searchResults)) && (
          <div className="absolute top-14 left-0 right-0 z-50">
            {isFocused && !searchTerm && recentSearches.length > 0 && (
              <Card className="absolute z-20 w-full mt-1 shadow-lg overflow-hidden rounded-md">
                <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                  <div className="py-2">
                    <div className="px-4 flex items-center justify-between mb-2">
                      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Recent Searches
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          localStorage.removeItem("recentSearches");
                          setRecentSearches([]);
                        }}
                        className="text-xs text-gray-500 hover:text-red-500"
                      >
                        Clear History
                      </Button>
                    </div>
                    {recentSearches.map((search) => (
                      <div
                        key={search.timestamp}
                        onClick={() => {
                          setValue("searchTerm", search.term);
                          onSubmit({ searchTerm: search.term });
                        }}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-grow">
                            <h3 className="text-sm font-medium text-gray-900">
                              {search.term}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {showSuggestions && searchResults && (
              <Card className="absolute z-20 w-full mt-1 shadow-lg overflow-hidden rounded-md">
                <CardContent className="p-0 max-h-[600px] overflow-y-auto divide-y divide-gray-100">
                  <SearchSuggestions
                    brands={searchResults.brands}
                    categories={searchResults.categories}
                    products={searchResults.products}
                    onSelectBrand={handleBrandSelect}
                    onSelectCategory={handleCategorySelect}
                    onSelectProduct={handleProductSelect}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}
