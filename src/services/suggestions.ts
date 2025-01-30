import { Prisma } from "@prisma/client";
import axios from "axios";

export type BrandWithCount = Prisma.BrandGetPayload<{
  select: {
    name: true;
    image: true;
    countryOfOrigin: true;
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  select: {
    name: true;
    image: true;
    _count: {
      select: {
        primaryProducts: true;
        secondaryProducts: true;
        tertiaryProducts: true;
        quaternaryProducts: true;
      };
    };
  };
}>;

export type InventoryWithProduct = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    product: {
      select: {
        name: true;
        images: true;
        promotionalPrice: true;
        retailPrice: true;
        features: true;
        model: true;
        type: true;
        brand: {
          select: {
            name: true;
            image: true;
            countryOfOrigin: true;
          };
        };
        primaryCategory: { select: { name: true } };
        secondaryCategory: { select: { name: true } };
        tertiaryCategory: { select: { name: true } };
        quaternaryCategory: { select: { name: true } };
      };
    };
  };
}>;

type SearchResults = {
  brands: BrandWithCount[];
  categories: CategoryWithCount[];
  products: InventoryWithProduct[];
};

export const fetchSuggestions = async (
  term: string
): Promise<SearchResults> => {
  const { data } = await axios.get(
    `/api/search-suggestions?term=${encodeURIComponent(term)}`
  );
  return data;
};
