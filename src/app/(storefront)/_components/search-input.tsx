"use client";

import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchSuggestions from "./search-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { fetchSuggestions } from "@/services/suggestions";

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
  const [isTypingEffect, setIsTypingEffect] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const { control, handleSubmit, watch, setValue, resetField } =
    useForm<FormData>({
      defaultValues: {
        searchTerm: "",
      },
    });

  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const prevSearchTermLength = useRef<number>(0);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const searches = localStorage.getItem("recentSearches");
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
      localStorage.removeItem("recentSearches");
    }
  }, []);

  // Initialize search term from URL query parameter
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setValue("searchTerm", searchQuery);
      prevSearchTermLength.current = searchQuery.length;
    }
  }, [searchParams, setValue]);

  // Simple effect to handle typing activity
  useEffect(() => {
    if (isFocused && !isNavigating) {
      const currentLength = searchTerm.length;
      const prevLength = prevSearchTermLength.current;

      // If the user is typing (length changes)
      if (currentLength !== prevLength) {
        // When user types something, show the backdrop immediately
        if (currentLength > 0) {
          setShowBackdrop(true);
        } else if (currentLength === 0 && recentSearches.length > 0) {
          // Show backdrop for recent searches when input is empty
          setShowBackdrop(true);
        } else {
          // Hide backdrop when empty and no recent searches
          setShowBackdrop(false);
        }
      }

      prevSearchTermLength.current = currentLength;
    }
  }, [searchTerm, isFocused, isNavigating, recentSearches.length]);

  // Reset typing effect on page change
  useEffect(() => {
    if (pathname === "/") {
      setIsTypingEffect(true);
    } else {
      setIsTypingEffect(false);
      setPlaceholder("Search for products");
    }
  }, [pathname]);

  // Fetch suggestions
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

  // Update suggestions visibility based on search results
  useEffect(() => {
    if (
      debouncedSearchTerm.trim() &&
      isFocused &&
      !isLoading &&
      !isError &&
      searchResults
    ) {
      if (
        searchResults.brands?.length ||
        searchResults.categories?.length ||
        searchResults.products?.length
      ) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, isFocused, searchResults, isLoading, isError]);

  // Typing effect
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setShowBackdrop(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (showBackdrop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showBackdrop]);

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
      // Add to recent searches
      addRecentSearch(data.searchTerm.trim());

      // Set navigating flag to prevent UI from showing during navigation
      setIsNavigating(true);

      // Clear UI state before navigation
      setShowSuggestions(false);
      setShowBackdrop(false);

      // Navigate to search results
      router.push(
        `/products?search=${encodeURIComponent(data.searchTerm.trim())}`
      );

      // Reset navigation flag after navigation (important for typing after navigation)
      setTimeout(() => {
        setIsNavigating(false);
      }, 100);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsTypingEffect(false);
    setPlaceholder("Search for products");

    // Show backdrop if we have a search term or recent searches
    if (searchTerm || (!searchTerm && recentSearches.length > 0)) {
      setShowBackdrop(true);
    }

    // Show suggestions if we have a search term and valid results
    if (
      searchTerm &&
      searchResults &&
      (searchResults.brands?.length ||
        searchResults.categories?.length ||
        searchResults.products?.length)
    ) {
      setShowSuggestions(true);
    }
  };

  const handleClear = () => {
    resetField("searchTerm");
    setShowSuggestions(false);
  };

  return (
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black/40 transition-opacity duration-200"
          onClick={() => {
            setIsFocused(false);
            setShowBackdrop(false);
            setShowSuggestions(false);
          }}
          style={{ zIndex: 40 }}
        />
      )}

      <div
        ref={searchContainerRef}
        className="flex-1 relative max-w-2xl mx-auto"
        style={{ zIndex: 50 }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative"
          autoComplete="off"
        >
          <div
            className={cn(
              "flex h-12 items-center bg-gray-100 rounded-md border shadow-sm transition-all duration-200",
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
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
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

        {((!searchTerm && showBackdrop && recentSearches.length > 0) ||
          (showSuggestions && searchResults)) && (
          <div className="absolute top-14 left-0 right-0 z-50">
            {showBackdrop && !searchTerm && recentSearches.length > 0 && (
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
                          // Set navigating flag to prevent UI from showing during navigation
                          setIsNavigating(true);
                          // Reset UI state before navigation
                          setShowSuggestions(false);
                          setShowBackdrop(false);
                          setIsFocused(false);
                          router.push(
                            `/products?search=${encodeURIComponent(
                              search.term
                            )}`
                          );
                          // Reset navigation flag after navigation
                          setTimeout(() => {
                            setIsNavigating(false);
                          }, 100);
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
                    brands={searchResults.brands || []}
                    categories={searchResults.categories || []}
                    products={searchResults.products || []}
                    onClose={() => {
                      setShowSuggestions(false);
                      setShowBackdrop(false);
                      setIsFocused(false);
                    }}
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
