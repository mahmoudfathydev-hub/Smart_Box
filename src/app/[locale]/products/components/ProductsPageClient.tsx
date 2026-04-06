"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Product, ProductsResponse, ProductQueryParams } from "@/types/product";
import { useAppDispatch } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import TopSearchBar from "./TopSearchBar";
import FiltersSidebar from "./FiltersSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import VirtualizedGrid from "./VirtualizedGrid";
import EmptyState from "./EmptyState";
import SkeletonLoader from "./SkeletonLoader";
import { useProducts } from "./useProducts";
import { useClientFilters } from "./useClientFilters";

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialPagination: ProductsResponse["pagination"];
  categories: string[];
  brands: string[];
  maxPrice: number;
  initialFilters: ProductQueryParams;
  locale: string;
  dict: any;
}

export default function ProductsPageClient({
  initialProducts,
  initialPagination,
  categories,
  brands,
  maxPrice,
  initialFilters,
  locale,
  dict,
}: ProductsPageClientProps) {
  const dispatch = useAppDispatch();
  const isRTL = locale === "ar";

  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const scrollTriggerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Use the custom hook for product fetching
  const {
    products: fetchedProducts,
    loading,
    error,
    hasMore,
    currentPage,
    totalItems,
    fetchMore,
    refetch,
    updateFilters,
  } = useProducts(initialFilters);

  // Combine initial products with fetched products
  const allProducts = useMemo(() => {
    if (currentPage === 1 && fetchedProducts.length === 0) {
      return initialProducts;
    }
    return fetchedProducts.length > 0 ? fetchedProducts : initialProducts;
  }, [fetchedProducts, initialProducts, currentPage]);

  // Use client-side filtering
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
    activeFiltersCount,
  } = useClientFilters(allProducts, initialFilters);

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
    if (isNearBottom && hasMore && !loading) {
      fetchMore();
    }
  }, [isNearBottom, hasMore, loading, fetchMore]);

  // Handle product interactions
  const handleProductClick = useCallback(
    (product: Product) => {
      // Navigate to product detail page
      window.location.href = `/${locale}/products/${product.slug}`;
    },
    [locale],
  );

  const handleAddToCart = useCallback((product: Product) => {
    // Add to cart logic
    console.log("Adding to cart:", product.name);
    // You can dispatch to Redux here if needed
  }, []);

  const handleToggleFavorite = useCallback((product: Product) => {
    setFavoriteIds((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(product.id)) {
        newFavorites.delete(product.id);
      } else {
        newFavorites.add(product.id);
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

  // Determine pagination strategy
  const totalProducts = allProducts.length;
  const useBasicPagination = totalProducts < 100 && totalProducts >= 20;
  const showAllProducts = totalProducts < 20;

  // Determine which grid to use
  const shouldUseVirtualized = filteredProducts.length > 50 && !showAllProducts;

  // Loading state
  if (loading && allProducts.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? "rtl" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SkeletonLoader count={12} />
        </div>
      </div>
    );
  }

  // Error state
  if (error && allProducts.length === 0) {
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
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
        totalResults={filteredProducts.length}
        loading={loading}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
            <FiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              categories={categories}
              brands={brands}
              maxPrice={maxPrice}
            />
          </div>

          {/* Products Grid */}
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
            {filteredProducts.length === 0 && !loading && (
              <EmptyState type="no-results" onClearFilters={handleClearFilters} />
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 && (
              <>
                {shouldUseVirtualized ? (
                  <div className="h-[600px]">
                    <VirtualizedGrid
                      products={filteredProducts}
                      onProductClick={handleProductClick}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                      favoriteIds={favoriteIds}
                    />
                  </div>
                ) : (
                  <ProductGrid
                    products={filteredProducts}
                    loading={loading}
                    error={error}
                    onProductClick={handleProductClick}
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
                    showAllProducts={showAllProducts}
                  />
                )}
              </>
            )}

            {/* Infinite Scroll Trigger */}
            {hasMore && filteredProducts.length > 0 && (
              <div ref={scrollTriggerRef} className="py-8">
                {loading && <SkeletonLoader count={4} />}
              </div>
            )}

            {/* No more products indicator */}
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center py-8 text-gray-500">No more products to load</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
