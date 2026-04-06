import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { ProductQueryParams } from "@/types/product";
import { productsDictionary } from "@/dict/Products/en";
import { productsDictionary as productsDictionaryAr } from "@/dict/Products/ar";

interface FiltersSidebarProps {
  filters: ProductQueryParams;
  onFiltersChange: (filters: Partial<ProductQueryParams>) => void;
  onClearFilters: () => void;
  categories: string[];
  brands: string[];
  maxPrice: number;
  className?: string;
}

export default function FiltersSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
  categories = [],
  brands = [],
  maxPrice = 1000,
  className = "",
}: FiltersSidebarProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;
  const dict = locale === Language.AR ? productsDictionaryAr : productsDictionary;

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
    availability: true,
  });

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      onFiltersChange({ category: checked ? category : undefined });
    },
    [onFiltersChange],
  );

  const handleBrandChange = useCallback(
    (brand: string, checked: boolean) => {
      onFiltersChange({ brand: checked ? brand : undefined });
    },
    [onFiltersChange],
  );

  const handlePriceChange = useCallback(
    (value: number[]) => {
      onFiltersChange({
        minPrice: value[0] > 0 ? value[0] : undefined,
        maxPrice: value[1] < maxPrice ? value[1] : undefined,
      });
    },
    [onFiltersChange, maxPrice],
  );

  const handleRatingChange = useCallback(
    (rating: number, checked: boolean) => {
      onFiltersChange({ rating: checked ? rating : undefined });
    },
    [onFiltersChange],
  );

  const handleAvailabilityChange = useCallback(
    (availability: string, checked: boolean) => {
      onFiltersChange({ availability: checked ? (availability as any) : "all" });
    },
    [onFiltersChange],
  );

  const currentPriceRange = [filters.minPrice || 0, filters.maxPrice || maxPrice];

  const hasActiveFilters = !!(
    filters.category ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined ||
    (filters.availability && filters.availability !== "all")
  );

  return (
    <div className={`w-full lg:w-80 space-y-4 ${className} ${isRTL ? "rtl" : ""}`}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{dict.filters.title}</CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters} className="h-8">
                <X className="w-3 h-3 mr-1" />
                {dict.filters.clearAll}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection("categories")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{dict.filters.categories.title}</CardTitle>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.categories && (
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-all"
                  checked={!filters.category}
                  onCheckedChange={() => onFiltersChange({ category: undefined })}
                />
                <Label htmlFor="category-all" className="text-sm font-medium">
                  {dict.filters.categories.all}
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category === category}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection("price")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{dict.filters.price.title}</CardTitle>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.price && (
          <CardContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={currentPriceRange}
                onValueChange={handlePriceChange}
                max={maxPrice}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">{dict.filters.price.from}</span>
                <span className="font-medium">${currentPriceRange[0]}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-500">{dict.filters.price.to}</span>
                <span className="font-medium">${currentPriceRange[1]}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection("brands")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{dict.filters.brands.title}</CardTitle>
            {expandedSections.brands ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.brands && (
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brand-all"
                  checked={!filters.brand}
                  onCheckedChange={() => onFiltersChange({ brand: undefined })}
                />
                <Label htmlFor="brand-all" className="text-sm font-medium">
                  {dict.filters.brands.all}
                </Label>
              </div>
              {brands.slice(0, 10).map((brand, index) => (
                <div key={`${brand}-${index}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brand === brand}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection("rating")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{dict.filters.rating.title}</CardTitle>
            {expandedSections.rating ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.rating && (
          <CardContent className="space-y-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-1">{dict.filters.rating.andUp}</span>
                  </div>
                </Label>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleSection("availability")}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              {dict.filters.availability.title}
            </CardTitle>
            {expandedSections.availability ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.availability && (
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availability-all"
                  checked={!filters.availability || filters.availability === "all"}
                  onCheckedChange={() => onFiltersChange({ availability: "all" })}
                />
                <Label htmlFor="availability-all" className="text-sm font-medium">
                  {dict.filters.availability.all}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availability-in-stock"
                  checked={filters.availability === "in_stock"}
                  onCheckedChange={(checked) =>
                    handleAvailabilityChange("in_stock", checked as boolean)
                  }
                />
                <Label htmlFor="availability-in-stock" className="text-sm">
                  {dict.filters.availability.inStock}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availability-out-of-stock"
                  checked={filters.availability === "out_of_stock"}
                  onCheckedChange={(checked) =>
                    handleAvailabilityChange("out_of_stock", checked as boolean)
                  }
                />
                <Label htmlFor="availability-out-of-stock" className="text-sm">
                  {dict.filters.availability.outOfStock}
                </Label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
