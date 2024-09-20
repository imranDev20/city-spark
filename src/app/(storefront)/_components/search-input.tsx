"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSearchSuggestions } from "../products/actions";
import SearchSuggestions from "./search-suggestions";
import { useDebounce } from "@/hooks/use-debounce";

const messages = [
  "boilers",
  "heaters",
  "bathroom & kitchen tiles",
  "plumbing tools and items",
  "spares",
  "renewables",
  "electrical & lighting items",
  "clearance",
  // Add more messages as needed
];

type Suggestion = {
  id: string;
  name: string;
  tradePrice: number | null;
  images: string[];
};

export default function SearchInput() {
  const [placeholder, setPlaceholder] = useState("Search for ");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.trim()) {
        try {
          const fetchedSuggestions = await getSearchSuggestions(
            debouncedSearchTerm
          );
          setSuggestions(fetchedSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    router.push(`/products/${suggestion.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 relative bg-transparent bg-white rounded-full max-w-lg"
    >
      <div className="flex-1 h-11 flex items-center bg-gray-500/10 shadow-sm">
        <Input
          className="w-full border-0 h-full py-5 ring-0 typing-placeholder px-7 rounded-l-full focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        <Button
          type="submit"
          className="h-full bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-none min-w-20 rounded-r-full"
        >
          <SearchIcon />
        </Button>
      </div>
      {showSuggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
        />
      )}
    </form>
  );
}
