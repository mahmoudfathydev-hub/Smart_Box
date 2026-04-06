"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, X, ChevronDown, ChevronUp } from "lucide-react";
import { ProductsFilters as ProductsFiltersType } from "@/redux/modules/products/types";

interface ProductsFiltersProps {
  filters: ProductsFiltersType;
  onFilterChange: (filters: Partial<ProductsFiltersType>) => void;
}

export default function ProductsFilters({
  filters,
  onFilterChange,
}: ProductsFiltersProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  // Local state for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: false,
    rating: false,
    availability: false,
    tags: false,
  });

  // Local state for price range
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  // Handle category change
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ category });
    } else {
      onFilterChange({ category: undefined });
    }
  };

  // Handle brand change
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ brand });
    } else {
      onFilterChange({ brand: undefined });
    }
  };

  // Handle rating change
  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      onFilterChange({ rating });
    } else {
      onFilterChange({ rating: undefined });
    }
  };

  // Handle availability change
  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ availability: availability as any });
    } else {
      onFilterChange({ availability: "all" });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({
      search: undefined,
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      availability: "all",
      tags: undefined,
    });
    setPriceRange([0, 1000]);
  };

  // Mock data for filters (in a real app, this would come from Redux/API)
  const categories = [
    { id: "electronics", name: dictionary.filters.categories.electronics },
    { id: "clothing", name: dictionary.filters.categories.clothing },
    { id: "home", name: dictionary.filters.categories.home },
    { id: "sports", name: dictionary.filters.categories.sports },
    { id: "books", name: dictionary.filters.categories.books },
    { id: "toys", name: dictionary.filters.categories.toys },
  ];

  const brands = [
    { id: "apple", name: "Apple" },
    { id: "samsung", name: "Samsung" },
    { id: "nike", name: "Nike" },
    { id: "adidas", name: "Adidas" },
    { id: "sony", name: "Sony" },
  ];

  const tags = [
    { id: "sale", name: dictionary.filters.tags.sale },
    { id: "new", name: dictionary.filters.tags.new },
    { id: "popular", name: dictionary.filters.tags.popular },
    { id: "trending", name: dictionary.filters.tags.trending },
    { id: "limited", name: dictionary.filters.tags.limited },
    { id: "premium", name: dictionary.filters.tags.premium },
  ];

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{dictionary.filters.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            {dictionary.filters.clearAll}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("categories")}
          >
            <h3 className="font-medium">
              {dictionary.filters.categories.title}
            </h3>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedSections.categories && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.category === category.id}
                    onCheckedChange={(checked: boolean) =>
                      handleCategoryChange(category.id, checked)
                    }
                  />
                  <Label htmlFor={category.id} className="text-sm">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("price")}
          >
            <h3 className="font-medium">{dictionary.filters.price.title}</h3>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedSections.price && (
            <div className="space-y-4">
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="min-price">
                    {dictionary.filters.price.from}
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceRangeChange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="w-20 h-8"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="max-price">
                    {dictionary.filters.price.to}
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceRangeChange([
                        priceRange[0],
                        parseInt(e.target.value) || 1000,
                      ])
                    }
                    className="w-20 h-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("brands")}
          >
            <h3 className="font-medium">{dictionary.filters.brands.title}</h3>
            {expandedSections.brands ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedSections.brands && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={filters.brand === brand.id}
                    onCheckedChange={(checked: boolean) =>
                      handleBrandChange(brand.id, checked)
                    }
                  />
                  <Label htmlFor={brand.id} className="text-sm">
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("rating")}
          >
            <h3 className="font-medium">{dictionary.filters.rating.title}</h3>
            {expandedSections.rating ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onCheckedChange={(checked: boolean) =>
                      handleRatingChange(rating, checked)
                    }
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm flex items-center"
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1">
                        {dictionary.filters.rating.andUp}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Availability */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("availability")}
          >
            <h3 className="font-medium">
              {dictionary.filters.availability.title}
            </h3>
            {expandedSections.availability ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedSections.availability && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.availability === "in_stock"}
                  onCheckedChange={(checked: boolean) =>
                    handleAvailabilityChange("in_stock", checked)
                  }
                />
                <Label htmlFor="in-stock" className="text-sm">
                  {dictionary.filters.availability.inStock}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="out-of-stock"
                  checked={filters.availability === "out_of_stock"}
                  onCheckedChange={(checked: boolean) =>
                    handleAvailabilityChange("out_of_stock", checked)
                  }
                />
                <Label htmlFor="out-of-stock" className="text-sm">
                  {dictionary.filters.availability.outOfStock}
                </Label>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Tags */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("tags")}
          >
            <h3 className="font-medium">{dictionary.filters.tags.title}</h3>
            {expandedSections.tags ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedSections.tags && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    filters.tags?.includes(tag.id) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    const currentTags = filters.tags || [];
                    const newTags = currentTags.includes(tag.id)
                      ? currentTags.filter((t) => t !== tag.id)
                      : [...currentTags, tag.id];
                    onFilterChange({ tags: newTags });
                  }}
                >
                  {tag.name}
                  {filters.tags?.includes(tag.id) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <Button className="w-full" onClick={() => {}}>
          {dictionary.filters.apply}
        </Button>
      </CardContent>
    </Card>
  );
}
