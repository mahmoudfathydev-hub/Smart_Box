"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Accessory, AccessoriesResponse, AccessoryQueryParams } from "@/types/accessory";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import TopSearchBar from "../../products/components/TopSearchBar";
import FiltersSidebar from "../../products/components/FiltersSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import VirtualizedGrid from "../../products/components/VirtualizedGrid";
import EmptyState from "../../products/components/EmptyState";
import SkeletonLoader from "../../products/components/SkeletonLoader";
import { useAccessories } from "./useAccessories";
import { useClientFilters } from "./useClientFilters";

interface AccessoriesPageClientProps {
  initialAccessories: Accessory[];
  initialPagination: AccessoriesResponse["pagination"];
  types: string[];
  brands: string[];
  maxPrice: number;
  initialFilters: AccessoryQueryParams;
  locale: string;
  dict: any;
}

export default function AccessoriesPageClient({
  initialAccessories,
  initialPagination,
  types,
  brands,
  maxPrice,
  initialFilters,
  locale,
  dict,
}: AccessoriesPageClientProps) {
  const dispatch = useAppDispatch();
  const isRTL = locale === "ar";

  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const scrollTriggerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Use the custom hook for accessory fetching
  const {
    accessories: fetchedAccessories,
    loading,
    error,
    hasMore,
    currentPage,
    totalItems,
    fetchMore,
    refetch,
    updateFilters,
  } = useAccessories(initialFilters);

  // Combine initial accessories with fetched accessories
  const allAccessories = useMemo(() => {
    if (currentPage === 1 && fetchedAccessories.length === 0) {
      return initialAccessories;
    }
    return fetchedAccessories.length > 0 ? fetchedAccessories : initialAccessories;
  }, [fetchedAccessories, initialAccessories, currentPage]);

  // Determine pagination strategy
  const totalAccessories = totalItems || allAccessories.length;
  const useBasicPagination = totalAccessories < 100 && totalAccessories >= 20;
  const showAllAccessories = totalAccessories < 20;
  const disableInfiniteScroll = showAllAccessories || useBasicPagination;

  // Use client-side filtering
  const {
    filteredAccessories,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
    activeFiltersCount,
  } = useClientFilters(allAccessories, initialFilters);

  // Simple scroll-based infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Trigger when user is within 500px of bottom
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 500;
      setIsNearBottom(nearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite scroll trigger
  useEffect(() => {
    if (isNearBottom && hasMore && !loading && !disableInfiniteScroll) {
      fetchMore();
    }
  }, [isNearBottom, hasMore, loading, fetchMore, disableInfiniteScroll]);

  // Handle accessory interactions
  const handleAccessoryClick = useCallback(
    (accessory: Accessory) => {
      // Navigate to accessory detail page
      window.location.href = `/${locale}/accessories/${accessory.slug}`;
    },
    [locale],
  );

  const handleAddToCart = useCallback((accessory: Accessory) => {
    // Add to cart logic
    console.log("Adding to cart:", accessory.name);
    // You can dispatch to Redux here if needed
  }, []);

  const handleToggleFavorite = useCallback((accessory: Accessory) => {
    setFavoriteIds((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(accessory.id)) {
        newFavorites.delete(accessory.id);
      } else {
        newFavorites.add(accessory.id);
      }
      return newFavorites;
    });
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setSearchQuery("");
  }, [clearFilters, setSearchQuery]);

  // Determine which grid to use
  const shouldUseVirtualized = filteredAccessories.length > 50 && !showAllAccessories;

  // Loading state
  if (loading && allAccessories.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? "rtl" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SkeletonLoader count={12} />
        </div>
      </div>
    );
  }

  // Error state
  if (error && allAccessories.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? "rtl" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <EmptyState type="error" message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? "rtl" : ""}`}>
      {/* Top Search Bar */}
      <TopSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters as any}
        onFiltersChange={setFilters as any}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
        totalResults={filteredAccessories.length}
        loading={loading}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
            <FiltersSidebar
              filters={filters as any}
              onFiltersChange={setFilters as any}
              onClearFilters={handleClearFilters}
              categories={types} // Use types as categories for accessories
              brands={brands}
              maxPrice={maxPrice}
            />
          </div>

          {/* Accessories Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-left font-medium"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Empty State */}
            {filteredAccessories.length === 0 && !loading && (
              <EmptyState type="no-results" onClearFilters={handleClearFilters} />
            )}

            {/* Accessories Grid */}
            {filteredAccessories.length > 0 && (
              <>
                {shouldUseVirtualized ? (
                  <div className="h-[600px]">
                    <VirtualizedGrid
                      products={filteredAccessories as any} // Reuse component, expects products
                      onProductClick={handleAccessoryClick}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={favoriteIds}
                    />
                  </div>
                ) : (
                  <ProductGrid
                    products={filteredAccessories as any} // Reuse component, expects products
                    loading={loading}
                    error={error}
                    onProductClick={handleAccessoryClick}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    favoriteIds={favoriteIds}
                    columns={{
                      mobile: 1,
                      tablet: 2,
                      desktop: 3,
                      large: 3, // Changed from 4 to 3
                    }}
                    useBasicPagination={useBasicPagination}
                    showAllProducts={showAllAccessories}
                  />
                )}
              </>
            )}

            {hasMore && filteredAccessories.length > 0 && !showAllAccessories && (
              <div ref={scrollTriggerRef} className="py-8">
                {loading && <SkeletonLoader count={4} />}
              </div>
            )}

            {/* No more accessories indicator */}
            {!hasMore && filteredAccessories.length > 0 && (
              <div className="text-center py-8 text-gray-500">No more accessories to load</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
