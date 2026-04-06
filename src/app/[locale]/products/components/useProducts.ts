import React, { useState, useCallback, useMemo } from "react";
import { Product, ProductQueryParams, ProductsResponse } from "@/types/product";
import { ProductRepository } from "@/lib/repositories/product.repository";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalItems: number;
  fetchMore: () => Promise<void>;
  refetch: (params?: ProductQueryParams) => Promise<void>;
  updateFilters: (filters: Partial<ProductQueryParams>) => void;
  filters: ProductQueryParams;
}

export function useProducts(initialParams: ProductQueryParams = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<ProductQueryParams>({
    limit: 30,
    sortBy: "created_at",
    sortOrder: "desc",
    ...initialParams,
  });

  const fetchProducts = useCallback(async (page: number, params: ProductQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: ProductsResponse = await ProductRepository.getAllProducts({
        ...params,
        page,
      });

      if (page === 1) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }

      setTotalItems(response.pagination.totalItems);
      setHasMore(response.pagination.hasNextPage);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchProducts(currentPage + 1, filters);
  }, [currentPage, filters, hasMore, loading, fetchProducts]);

  const refetch = useCallback(
    async (newParams?: ProductQueryParams) => {
      const params = newParams || filters;
      await fetchProducts(1, params);
    },
    [filters, fetchProducts],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<ProductQueryParams>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 };
      setFilters(updatedFilters);
      refetch(updatedFilters);
    },
    [filters, refetch],
  );

  return {
    products,
    loading,
    error,
    hasMore,
    currentPage,
    totalItems,
    fetchMore,
    refetch,
    updateFilters,
    filters,
  };
}
