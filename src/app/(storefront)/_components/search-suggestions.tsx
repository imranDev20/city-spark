"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BrandWithCount,
  CategoryWithCount,
  InventoryWithProduct,
} from "@/services/suggestions";
import { NumericFormat } from "react-number-format";
import { Separator } from "@/components/ui/separator";
import PlaceholderImage from "@/images/placeholder-image.png";

type SearchSuggestionsProps = {
  brands: BrandWithCount[];
  categories: CategoryWithCount[];
  products: InventoryWithProduct[];
  onClose: () => void;
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  show: boolean;
}> = ({ title, children, show }) => {
  if (!show) return null;

  return (
    <div className="py-2">
      <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  brands,
  categories,
  products,
  onClose,
}) => {
  const router = useRouter();

  if (brands.length === 0 && categories.length === 0 && products.length === 0) {
    return null;
  }

  // Calculate which sections are visible
  const hasBrands = brands.length > 0;
  const hasCategories = categories.length > 0;
  const hasProducts = products.length > 0;

  // Handlers moved inside the component
  const handleBrandSelect = (e: React.MouseEvent, brand: BrandWithCount) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    router.push(`/brands/${encodeURIComponent(brand.name.toLowerCase())}`);
  };

  const handleCategorySelect = (
    e: React.MouseEvent,
    category: CategoryWithCount
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    router.push(
      `/categories/${encodeURIComponent(category.name.toLowerCase())}`
    );
  };

  const handleProductSelect = (
    e: React.MouseEvent,
    product: InventoryWithProduct
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    router.push(
      `/products/p/${encodeURIComponent(product.product.name)}/p/${product.id}`
    );
  };

  return (
    <div className="overflow-y-auto overscroll-contain lg:max-h-[60vh] max-h-[calc(100vh-127px)]">
      {hasBrands && (
        <>
          <Section title="Brands" show={true}>
            <div className="space-y-1">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                  onClick={(e) => handleBrandSelect(e, brand)}
                >
                  <div className="flex items-center space-x-4">
                    {brand.image && (
                      <div className="flex-shrink-0 w-12 h-12 relative">
                        <Image
                          src={brand.image}
                          alt={brand.name}
                          fill
                          sizes="48px"
                          className="rounded-md object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900">
                        {brand.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {brand._count.products} products
                        {brand.countryOfOrigin && ` • ${brand.countryOfOrigin}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          {(hasCategories || hasProducts) && (
            <div className="px-4">
              <Separator className="my-2" />
            </div>
          )}
        </>
      )}

      {hasCategories && (
        <>
          <Section title="Categories" show={true}>
            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                  onClick={(e) => handleCategorySelect(e, category)}
                >
                  <div className="flex items-center space-x-4">
                    {category.image && (
                      <div className="flex-shrink-0 w-12 h-12 relative">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="48px"
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {category._count.primaryProducts +
                          category._count.secondaryProducts +
                          category._count.tertiaryProducts +
                          category._count.quaternaryProducts}{" "}
                        products
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          {hasProducts && (
            <div className="px-4">
              <Separator className="my-2" />
            </div>
          )}
        </>
      )}

      {hasProducts && (
        <Section title="Products" show={true}>
          <div className="space-y-5">
            {products.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={(e) => handleProductSelect(e, suggestion)}
              >
                <div className="flex lg:items-center lg:space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 relative">
                    <Image
                      src={suggestion.product.images[0] || PlaceholderImage}
                      alt={suggestion.product.name}
                      fill
                      sizes="64px"
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center flex-1 min-w-0 ml-4 lg:ml-0">
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 break-words">
                        {suggestion.product.name}
                      </h3>
                    </div>
                    <div className="mt-3 lg:mt-0 lg:flex-shrink-0 lg:text-right">
                      {suggestion.product.promotionalPrice ? (
                        <div className="flex flex-col lg:items-end">
                          <div className="flex items-baseline gap-1">
                            <span className="text-normal font-semibold text-primary">
                              <NumericFormat
                                value={suggestion.product.promotionalPrice}
                                displayType="text"
                                prefix="£"
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator
                              />
                            </span>
                            <span className="text-[10px] text-gray-500 leading-none font-semibold">
                              inc. VAT
                            </span>
                          </div>
                          {suggestion.product.retailPrice ? (
                            <span className="text-normal text-gray-400 line-through">
                              <NumericFormat
                                value={suggestion.product.retailPrice}
                                displayType="text"
                                prefix="£"
                                decimalScale={2}
                                fixedDecimalScale
                                thousandSeparator
                              />
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-semibold text-primary">
                            <NumericFormat
                              value={suggestion.product.retailPrice || 0}
                              displayType="text"
                              prefix="£"
                              decimalScale={2}
                              fixedDecimalScale
                              thousandSeparator
                            />
                          </span>
                          <span className="text-[10px] text-gray-500 leading-none font-semibold">
                            inc. VAT
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default SearchSuggestions;
