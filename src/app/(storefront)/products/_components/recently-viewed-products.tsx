"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentlyViewedInventory } from "@/services/inventory";
import useEmblaCarousel from "embla-carousel-react";
import ProductCarousel from "../../_components/product-carousel";

const MAX_RECENT_PRODUCTS = 10;
const STORAGE_KEY = "recently_viewed_inventory";

interface RecentlyViewedProductsProps {
  currentInventoryId: string;
}

export default function RecentlyViewedProducts({
  currentInventoryId,
}: RecentlyViewedProductsProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recently viewed products:", error);
    }
  }, []);

  useEffect(() => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== currentInventoryId);
      const updated = [currentInventoryId, ...filtered];
      const limited = updated.slice(0, MAX_RECENT_PRODUCTS);

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      } catch (error) {
        console.error("Error saving recently viewed products:", error);
      }

      return limited;
    });
  }, [currentInventoryId]);

  const { data: inventoryItems = [], isLoading } = useQuery({
    queryKey: ["recentlyViewed", recentlyViewed],
    queryFn: async () => {
      const filteredIds = recentlyViewed.filter(
        (id) => id !== currentInventoryId
      );
      if (filteredIds.length === 0) return [];
      return fetchRecentlyViewedInventory(filteredIds);
    },
    enabled: recentlyViewed.length > 0,
  });

  if (isLoading || !inventoryItems.length) {
    return null;
  }

  return (
    <ProductCarousel
      inventoryItems={inventoryItems}
      title="Recently Viewed Products"
    />
  );
}
