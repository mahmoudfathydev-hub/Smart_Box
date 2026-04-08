import React from "react";
import ProductPageClient from "./components/ProductsPageClient";
import { Product, ProductsResponse, ProductQueryParams } from "@/types/product";

async function getProductsData(locale: string) {
  // Fetch products data - replace with your actual API call
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/products?locale=${locale}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductsResponse = await response.json();
  return data;
}

async function getCategories(locale: string) {
  // Fetch categories - replace with your actual API call
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/categories?locale=${locale}`);

  if (!response.ok) {
    return [];
  }

  const categories = await response.json();
  return categories;
}

async function getBrands(locale: string) {
  // Fetch brands - replace with your actual API call
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/brands?locale=${locale}`);

  if (!response.ok) {
    return [];
  }

  const brands = await response.json();
  return brands;
}

export default async function ProductsPage({ params: { locale } }: { params: { locale: string } }) {
  try {
    // Fetch all required data
    const [productsData, categories, brands] = await Promise.all([
      getProductsData(locale),
      getCategories(locale),
      getBrands(locale),
    ]);

    // Default initial filters
    const initialFilters: ProductQueryParams = {
      page: 1,
      limit: 20,
    };

    return (
      <ProductPageClient
        initialProducts={productsData.products}
        initialPagination={productsData.pagination}
        categories={categories}
        brands={brands}
        maxPrice={10000} // Set appropriate max price or fetch from API
        initialFilters={initialFilters}
        locale={locale}
        dict={{}} // Add your dictionary/translations here
      />
    );
  } catch (error) {
    console.error("Error loading products page:", error);

    // Return error state or fallback
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to load products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }
}
