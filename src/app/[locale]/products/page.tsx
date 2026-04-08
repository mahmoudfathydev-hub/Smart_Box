"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { fetchProducts } from "@/redux/modules/products/thunks";
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
  selectProductsFilters,
  selectHasProducts,
  selectTotalItems,
  selectCurrentPage,
  selectTotalPages,
} from "@/redux/modules/products/selectors";
import { setFilters, setCurrentPage } from "@/redux/modules/products/slice";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import ProductsHeader from "./components/ProductsHeader";
import ProductsToolbar from "./components/ProductsToolbar";
import ProductsFilters from "./components/ProductsFilters";
import ProductsGrid from "./components/ProductsGrid";
import ProductsPagination from "./components/ProductsPagination";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  // Redux state
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const pagination = useAppSelector(selectProductsPagination);
  const filters = useAppSelector(selectProductsFilters);
  const hasProducts = useAppSelector(selectHasProducts);
  const totalItems = useAppSelector(selectTotalItems);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);

  // Local state
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch products on component mount and when filters/page change
  const fetchProductsData = useCallback(async () => {
    try {
      console.log("Dispatching fetchProducts with params:", { page: currentPage, limit: 12, ...filters });
      await dispatch(
        fetchProducts({
          page: currentPage,
          limit: 12,
          ...filters,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [dispatch, currentPage, filters, isInitialLoad]);

  useEffect(() => {
    console.log("Fetching products with filters:", filters);
    console.log("Current page:", currentPage);
    fetchProductsData();
  }, [fetchProductsData]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1)); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Handle retry
  const handleRetry = () => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 12,
        ...filters,
      }),
    );
  };

  // Handle search
  const handleSearch = (query: string) => {
    handleFilterChange({ search: query });
  };

  // Loading skeleton
  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Toolbar Skeleton */}
          <div className="mb-8 flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-12 h-12 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {dictionary.error.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || dictionary.error.defaultMessage}
            </p>
            <Button onClick={handleRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {dictionary.error.retryButton}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && !hasProducts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <ProductsHeader
            title={dictionary.header.title}
            subtitle={dictionary.header.subtitle}
            totalItems={0}
          />

          <ProductsToolbar
            onSearch={handleSearch}
            onFiltersToggle={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            totalItems={0}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="lg:w-80 flex-shrink-0">
                <ProductsFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}

            {/* Empty State */}
            <div className="flex-1">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {dictionary.empty.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {dictionary.empty.message}
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange({})}
                >
                  {dictionary.empty.clearFilters}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ProductsHeader
          title={dictionary.header.title}
          subtitle={dictionary.header.subtitle}
          totalItems={totalItems}
        />

        {/* Toolbar */}
        <ProductsToolbar
          onSearch={handleSearch}
          onFiltersToggle={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          totalItems={totalItems}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <div className="lg:w-80 shrink-0">
              <ProductsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          <div className="flex-1">
            <ProductsGrid products={products} loading={loading} error={error} />

            {!loading && hasProducts && totalPages > 1 && (
              <div className="mt-12">
                <ProductsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
