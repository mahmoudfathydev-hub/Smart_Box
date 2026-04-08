import React, { useState, useCallback, useMemo } from "react";
import { Accessory, AccessoryQueryParams } from "@/types/accessory";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";

interface UseClientFiltersResult {
  filteredAccessories: Accessory[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: AccessoryQueryParams;
  setFilters: (filters: Partial<AccessoryQueryParams>) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
}

export function useClientFilters(
  accessories: Accessory[],
  initialFilters: AccessoryQueryParams = {},
): UseClientFiltersResult {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AccessoryQueryParams>({
    type: undefined,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    status: "active",
    sortBy: "created_at",
    sortOrder: "desc",
    ...initialFilters,
  });

  const filteredAccessories = useMemo(() => {
    let filtered = [...accessories];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((accessory) => {
        const searchableFields = [
          accessory.name_en || "",
          accessory.name_ar || "",
          accessory.name || "",
          accessory.description_en || "",
          accessory.description_ar || "",
          accessory.description || "",
          accessory.brand || "",
          accessory.type || "",
          accessory.tags?.join(" ") || "",
          accessory.compatible_devices?.join(" ") || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableFields.includes(query);
      });
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(
        (accessory) => accessory.type === filters.type,
      );
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(
        (accessory) =>
          accessory.brand?.toLowerCase().includes(filters.brand!.toLowerCase()),
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((accessory) => {
        const price = accessory.discountPrice || accessory.price;
        return price >= filters.minPrice!;
      });
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((accessory) => {
        const price = accessory.discountPrice || accessory.price;
        return price <= filters.maxPrice!;
      });
    }

    // Apply status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (accessory) => accessory.status === filters.status,
      );
    }

    // Apply compatible devices filter
    if (filters.compatibleDevices && filters.compatibleDevices.length > 0) {
      filtered = filtered.filter((accessory) => {
        if (!accessory.compatible_devices) return false;
        return filters.compatibleDevices!.some((device) =>
          accessory.compatible_devices!.includes(device),
        );
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
          case "type":
            aValue = a.type || "";
            bValue = b.type || "";
            break;
          case "brand":
            aValue = a.brand || "";
            bValue = b.brand || "";
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
  }, [accessories, searchQuery, filters, locale]);

  const setFiltersInternal = useCallback((newFilters: Partial<AccessoryQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      type: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      status: "active",
      sortBy: "created_at",
      sortOrder: "desc",
    });
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = searchQuery.trim() ? 1 : 0;
    if (filters.type) count++;
    if (filters.brand) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.status && filters.status !== "all") count++;
    if (filters.compatibleDevices && filters.compatibleDevices.length > 0) count++;
    return count;
  }, [searchQuery, filters]);

  return {
    filteredAccessories,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters: setFiltersInternal,
    clearFilters,
    activeFiltersCount,
  };
}
