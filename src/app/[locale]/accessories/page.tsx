import React from "react";
import AccessoriesPageClient from "./components/AccessoriesPageClient";
import { Accessory, AccessoriesResponse, AccessoryQueryParams } from "@/types/accessory";

async function getAccessoriesData(locale: string) {
  // Fetch accessories data - replace with your actual API call
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/accessories?locale=${locale}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch accessories");
  }

  const data: AccessoriesResponse = await response.json();
  return data;
}

async function getTypes(locale: string) {
  // Fetch types - replace with your actual API call
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/accessories/types?locale=${locale}`);

  if (!response.ok) {
    return [];
  }

  const types = await response.json();
  return types;
}

async function getBrands(locale: string) {
  // Fetch brands - replace with your actual API call
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/accessories/brands?locale=${locale}`);

  if (!response.ok) {
    return [];
  }

  const brands = await response.json();
  return brands;
}

export default async function AccessoriesPage({ params: { locale } }: { params: { locale: string } }) {
  try {
    // Fetch all required data
    const [accessoriesData, types, brands] = await Promise.all([
      getAccessoriesData(locale),
      getTypes(locale),
      getBrands(locale),
    ]);

    // Default initial filters
    const initialFilters: AccessoryQueryParams = {
      page: 1,
      limit: 20,
    };

    return (
      <AccessoriesPageClient
        initialAccessories={accessoriesData.accessories}
        initialPagination={accessoriesData.pagination}
        types={types}
        brands={brands}
        maxPrice={10000} // Set appropriate max price or fetch from API
        initialFilters={initialFilters}
        locale={locale}
        dict={{}} // Add your dictionary/translations here
      />
    );
  } catch (error) {
    console.error("Error loading accessories page:", error);

    // Return error state or fallback
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to load accessories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }
}
