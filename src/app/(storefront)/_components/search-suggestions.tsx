import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

type Suggestion = {
  id: string;
  name: string;
  tradePrice: number | null;
  images: string[];
};

type SearchSuggestionsProps = {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="absolute z-10 w-full mt-1 shadow-lg">
      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
        {suggestions.map((suggestion) => (
          <Link
            key={suggestion.id}
            href={`/products/${suggestion.id}`}
            className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out border-b border-gray-100 last:border-b-0"
            onClick={() => onSelect(suggestion)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16 relative">
                <Image
                  src={suggestion.images[0] || "/placeholder-image.jpg"}
                  alt={suggestion.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {suggestion.name}
                </h3>
              </div>
              {suggestion.tradePrice && (
                <div className="flex-shrink-0 text-right">
                  <span className="text-sm font-semibold text-primary">
                    £{suggestion.tradePrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;
