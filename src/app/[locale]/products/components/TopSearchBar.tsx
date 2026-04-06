import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { ProductQueryParams } from "@/types/product";
import { productsDictionary } from "@/dict/Products/en";
import { productsDictionary as productsDictionaryAr } from "@/dict/Products/ar";

interface TopSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ProductQueryParams;
  onFiltersChange: (filters: Partial<ProductQueryParams>) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  totalResults: number;
  loading?: boolean;
}

export default function TopSearchBar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
  totalResults,
  loading = false,
}: TopSearchBarProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;
  const dict = locale === Language.AR ? productsDictionaryAr : productsDictionary;

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(debouncedSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, onSearchChange]);

  // Update debounced search when external search changes
  useEffect(() => {
    setDebouncedSearch(searchQuery);
  }, [searchQuery]);

  const handleSortChange = useCallback(
    (value: string) => {
      const [sortBy, sortOrder] = value.split("-");
      onFiltersChange({
        sortBy: sortBy as "name" | "price" | "rating" | "created_at",
        sortOrder: sortOrder as "asc" | "desc",
      });
    },
    [onFiltersChange],
  );

  const currentSortValue = `${filters.sortBy || "created_at"}-${filters.sortOrder || "desc"}`;

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 ${isRTL ? "rtl" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? "right-3 left-auto" : ""}`}
            />
            <Input
              type="text"
              placeholder={dict.toolbar.search}
              value={debouncedSearch}
              onChange={(e) => setDebouncedSearch(e.target.value)}
              className={`pl-10 pr-4 ${isRTL ? "pr-10 pl-4 text-right" : ""} h-12 text-base`}
              disabled={loading}
            />
            {debouncedSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDebouncedSearch("")}
                className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 p-1 h-auto`}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {dict.toolbar.sortBy}:
            </span>
            <Select value={currentSortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">{dict.sort.newest}</SelectItem>
                <SelectItem value="created_at-asc">{dict.sort.oldest}</SelectItem>
                <SelectItem value="name-asc">{dict.sort.nameAsc}</SelectItem>
                <SelectItem value="name-desc">{dict.sort.nameDesc}</SelectItem>
                <SelectItem value="price-asc">{dict.sort.priceAsc}</SelectItem>
                <SelectItem value="price-desc">{dict.sort.priceDesc}</SelectItem>
                <SelectItem value="rating-desc">{dict.sort.ratingDesc}</SelectItem>
                <SelectItem value="rating-asc">{dict.sort.ratingAsc}</SelectItem>
                <SelectItem value="relevance">{dict.sort.relevance}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                <Filter className="w-3 h-3 mr-1" />
                {activeFiltersCount} {dict.toolbar.activeFilters}
              </Badge>
              <Button variant="outline" size="sm" onClick={onClearFilters} className="h-8">
                {dict.filters.clearAll}
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {!loading && (
              <>
                {totalResults} {dict.header.results}
                {searchQuery && (
                  <span className="ml-2">
                    {dict.toolbar.search}: <strong>"{searchQuery}"</strong>
                  </span>
                )}
              </>
            )}
            {loading && <span>{dict.loading.loading}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
