import React, { useState, useCallback, useMemo } from "react";
import { Accessory, AccessoryQueryParams, AccessoriesResponse } from "@/types/accessory";
import { AccessoriesRepository } from "@/lib/repositories/accessories.repository";

interface UseAccessoriesResult {
  accessories: Accessory[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalItems: number;
  fetchMore: () => Promise<void>;
  refetch: (params?: AccessoryQueryParams) => Promise<void>;
  updateFilters: (filters: Partial<AccessoryQueryParams>) => void;
  filters: AccessoryQueryParams;
}

export function useAccessories(initialParams: AccessoryQueryParams = {}): UseAccessoriesResult {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<AccessoryQueryParams>({
    limit: 30,
    sortBy: "created_at",
    sortOrder: "desc",
    ...initialParams,
  });

  const fetchAccessories = useCallback(async (page: number, params: AccessoryQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: AccessoriesResponse = await AccessoriesRepository.getAllAccessories({
        ...params,
        page,
      });

      if (page === 1) {
        setAccessories(response.accessories);
      } else {
        setAccessories((prev) => [...prev, ...response.accessories]);
      }

      setTotalItems(response.pagination.totalItems);
      setHasMore(response.pagination.hasNextPage);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accessories");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchAccessories(currentPage + 1, filters);
  }, [currentPage, filters, hasMore, loading, fetchAccessories]);

  const refetch = useCallback(
    async (newParams?: AccessoryQueryParams) => {
      const params = newParams || filters;
      await fetchAccessories(1, params);
    },
    [filters, fetchAccessories],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<AccessoryQueryParams>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 };
      setFilters(updatedFilters);
      refetch(updatedFilters);
    },
    [filters, refetch],
  );

  return {
    accessories,
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
