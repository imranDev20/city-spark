"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SortProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort_by") || "relevance";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center">
      <label
        htmlFor="sort-select"
        className="text-sm text-gray-600 mr-2 hidden sm:inline"
      >
        Sort by:
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px] sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price_low_to_high">Price: Low to High</SelectItem>
          <SelectItem value="price_high_to_low">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="bestselling">Best Selling</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
