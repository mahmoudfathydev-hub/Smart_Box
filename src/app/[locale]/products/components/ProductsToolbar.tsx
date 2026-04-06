"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import { ProductsFilters } from "@/redux/modules/products/types";

interface ProductsToolbarProps {
  onSearch: (query: string) => void;
  onFiltersToggle: () => void;
  showFilters: boolean;
  totalItems: number;
}

export default function ProductsToolbar({
  onSearch,
  onFiltersToggle,
  showFilters,
  totalItems,
}: ProductsToolbarProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // This would typically dispatch a sort action to Redux
    // For now, we'll just update local state
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={dictionary.toolbar.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </form>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={dictionary.toolbar.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{dictionary.sort.relevance}</SelectItem>
              <SelectItem value="name_asc">{dictionary.sort.nameAsc}</SelectItem>
              <SelectItem value="name_desc">{dictionary.sort.nameDesc}</SelectItem>
              <SelectItem value="price_asc">{dictionary.sort.priceAsc}</SelectItem>
              <SelectItem value="price_desc">{dictionary.sort.priceDesc}</SelectItem>
              <SelectItem value="rating_desc">{dictionary.sort.ratingDesc}</SelectItem>
              <SelectItem value="rating_asc">{dictionary.sort.ratingAsc}</SelectItem>
              <SelectItem value="newest">{dictionary.sort.newest}</SelectItem>
              <SelectItem value="oldest">{dictionary.sort.oldest}</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={onFiltersToggle}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            {dictionary.toolbar.filters}
            {showFilters && <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          {totalItems > 0 ? (
            <span>
              {dictionary.pagination.showing} {totalItems} {dictionary.pagination.items}
            </span>
          ) : (
            <span>{dictionary.header.noResults}</span>
          )}
        </div>
        
        {/* Active Filters Count */}
        <div className="flex items-center gap-2">
          <span>{dictionary.toolbar.activeFilters}: 0</span>
          {/* This would show the actual count of active filters */}
        </div>
      </div>
    </div>
  );
}
