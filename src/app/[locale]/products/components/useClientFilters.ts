import React, { useState, useCallback, useMemo } from "react";
import { Product, ProductQueryParams } from "@/types/product";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";

interface UseClientFiltersResult {
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: ProductQueryParams;
  setFilters: (filters: Partial<ProductQueryParams>) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
}

export function useClientFilters(
  products: Product[],
  initialFilters: ProductQueryParams = {},
): UseClientFiltersResult {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductQueryParams>({
    category: undefined,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    availability: "all",
    sortBy: "created_at",
    sortOrder: "desc",
    ...initialFilters,
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const searchableFields = [
          product.name_en || "",
          product.name_ar || "",
          product.name || "",
          product.description_en || "",
          product.description_ar || "",
          product.description || "",
          product.brand_en || "",
          product.brand_ar || "",
          product.brand || "",
          product.category_en || "",
          product.category_ar || "",
          product.category || "",
          product.tags?.join(" ") || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableFields.includes(query);
      });
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.category_en === filters.category ||
          product.category_ar === filters.category ||
          product.category === filters.category,
      );
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(
        (product) =>
          product.brand_en?.toLowerCase().includes(filters.brand!.toLowerCase()) ||
          product.brand_ar?.includes(filters.brand!) ||
          product.brand?.toLowerCase().includes(filters.brand!.toLowerCase()),
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((product) => {
        const price = product.discountPrice || product.price;
        return price >= filters.minPrice!;
      });
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((product) => {
        const price = product.discountPrice || product.price;
        return price <= filters.maxPrice!;
      });
    }

    // Apply rating filter
    if (filters.rating !== undefined) {
      filtered = filtered.filter((product) => (product.rating || 0) >= filters.rating!);
    }

    // Apply availability filter
    if (filters.availability && filters.availability !== "all") {
      filtered = filtered.filter((product) => {
        if (filters.availability === "in_stock") {
          return (product.stockQuantity || 0) > 0;
        } else if (filters.availability === "out_of_stock") {
          return (product.stockQuantity || 0) === 0;
        }
        return true;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (filters.sortBy) {
          case "name":
            aValue =
              locale === Language.AR ? a.name_ar || a.name_en || a.name : a.name_en || a.name;
            bValue =
              locale === Language.AR ? b.name_ar || b.name_en || b.name : b.name_en || b.name;
            break;
          case "price":
            aValue = a.discountPrice || a.price;
            bValue = b.discountPrice || b.price;
            break;
          case "rating":
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case "created_at":
            aValue = new Date(a.createdAt || 0);
            bValue = new Date(b.createdAt || 0);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return filters.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchQuery, filters, locale]);

  const setFiltersInternal = useCallback((newFilters: Partial<ProductQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      availability: "all",
      sortBy: "created_at",
      sortOrder: "desc",
    });
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = searchQuery.trim() ? 1 : 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.rating !== undefined) count++;
    if (filters.availability && filters.availability !== "all") count++;
    return count;
  }, [searchQuery, filters]);

  return {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters: setFiltersInternal,
    clearFilters,
    activeFiltersCount,
  };
}
