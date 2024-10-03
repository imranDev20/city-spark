"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchSuggestions from "./search-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";

type InventoryWithProduct = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    product: {
      select: {
        name: true;
        images: true;
        tradePrice: true;
        features: true;
        primaryCategory: { select: { name: true } };
        secondaryCategory: { select: { name: true } };
        tertiaryCategory: { select: { name: true } };
        quaternaryCategory: { select: { name: true } };
      };
    };
  };
}>;

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

const fetchSuggestions = async (
  term: string
): Promise<InventoryWithProduct[]> => {
  const { data } = await axios.get(
    `/api/search-suggestions?term=${encodeURIComponent(term)}`
  );
  return data.suggestions;
};

export default function SearchInput() {
  const [placeholder, setPlaceholder] = useState("Search for ");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      searchTerm: "",
    },
  });

  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: suggestions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchSuggestions", debouncedSearchTerm],
    queryFn: () => fetchSuggestions(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
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
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    };

    const timeoutId = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [index, isDeleting, messageIndex]);

  useEffect(() => {
    setShowSuggestions(
      isFocused &&
        !!debouncedSearchTerm.trim() &&
        !isLoading &&
        !isError &&
        !!suggestions?.length
    );
  }, [debouncedSearchTerm, isLoading, isError, isFocused, suggestions]);

  const onSubmit = (data: FormData) => {
    if (data.searchTerm.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(data.searchTerm.trim())}`
      );
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: InventoryWithProduct) => {
    setValue("searchTerm", suggestion.product.name);
    setShowSuggestions(false);
    router.push(`/products/p/${suggestion.product.name}/p/${suggestion.id}`);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 relative bg-transparent bg-white rounded-full max-w-lg"
    >
      <div className="flex-1 h-11 flex items-center bg-gray-500/10 shadow-sm">
        <Controller
          name="searchTerm"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="w-full border-0 h-full py-5 ring-0 typing-placeholder px-7 rounded-l-full focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={placeholder}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        />

        <Button
          type="submit"
          className="h-full bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-none min-w-20 rounded-r-full"
        >
          <SearchIcon />
        </Button>
      </div>
      {showSuggestions && suggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
        />
      )}
    </form>
  );
}
