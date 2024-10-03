import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";

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

type SearchSuggestionsProps = {
  suggestions: InventoryWithProduct[];
  onSelect: (suggestion: InventoryWithProduct) => void;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="absolute z-10 w-full mt-1 shadow-lg overflow-hidden">
      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className={cn(
              "px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer",
              index !== suggestions.length - 1 && "border-b border-gray-100"
            )}
            onClick={() => onSelect(suggestion)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16 relative">
                <Image
                  src={suggestion.product.images[0] || "/placeholder-image.jpg"}
                  alt={suggestion.product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {suggestion.product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {[
                    suggestion.product.primaryCategory?.name,
                    suggestion.product.secondaryCategory?.name,
                    suggestion.product.tertiaryCategory?.name,
                    suggestion.product.quaternaryCategory?.name,
                  ]
                    .filter(Boolean)
                    .join(" > ")}
                </p>
                {suggestion.product.features.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {suggestion.product.features.join(", ")}
                  </p>
                )}
              </div>
              {suggestion.product.tradePrice && (
                <div className="flex-shrink-0 text-right">
                  <span className="text-sm font-semibold text-primary">
                    £{suggestion.product.tradePrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;
