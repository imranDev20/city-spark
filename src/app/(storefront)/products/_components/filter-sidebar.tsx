"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Separator } from "@/components/ui/separator";

const brands = [
  { name: "Alpha", count: 64 },
  { name: "Baxi", count: 64 },
  { name: "Firebird", count: 40 },
  { name: "Glow-worm", count: 50 },
  { name: "Ideal", count: 65 },
];

const FilterSidebar: React.FC = () => {
  const [brandSearch, setBrandSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    width: false,
    price: true,
  });
  const [priceRange, setPriceRange] = useState([99, 546]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <aside className="w-full max-w-xs">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold">Filters by</h4>
        <button className="text-sm text-gray-600 hover:underline">
          Clean all
        </button>
      </div>

      <Card className="shadow-sm border-gray-350">
        <div className="p-5 space-y-6">
          <div>
            <button
              className="w-full flex justify-between items-center pb-2"
              onClick={() => toggleSection("brands")}
            >
              <span className="font-semibold text-lg">Brands</span>
              <ChevronDown
                className={`transform transition-transform duration-200 ease-in-out ${
                  expandedSections.brands ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                expandedSections.brands ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3 space-y-3 px-0.5">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Search in brand"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="pl-10 bg-gray-100 border-gray-300"
                    />
                  </div>
                  <div className="space-y-4 ml-1">
                    {filteredBrands.map((brand) => (
                      <div key={brand.name} className="flex items-center">
                        <Checkbox
                          id={brand.name}
                          className="mr-3 border-gray-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={brand.name}
                          className="text-sm cursor-pointer"
                        >
                          {brand.name}{" "}
                          <span className="text-gray-500">({brand.count})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <button className="text-sm text-gray-600 hover:underline mt-1">
                    View all
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div>
            <button
              className="w-full flex justify-between items-center pb-2"
              onClick={() => toggleSection("width")}
            >
              <span className="font-semibold text-lg">Width</span>
              <ChevronDown
                className={`transform transition-transform duration-200 ease-in-out ${
                  expandedSections.width ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                expandedSections.width ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3">
                  {/* Add width filter content here */}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div>
            <button
              className="w-full flex justify-between items-center pb-2"
              onClick={() => toggleSection("price")}
            >
              <span className="font-semibold text-lg">Price</span>
              <ChevronDown
                className={`transform transition-transform duration-200 ease-in-out ${
                  expandedSections.price ? "rotate-180" : ""
                }`}
                size={20}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                expandedSections.price ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3 space-y-4 px-0.5">
                  <DualRangeSlider
                    min={0}
                    max={1000}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                    label={() => null}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full"
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
};

export default FilterSidebar;
