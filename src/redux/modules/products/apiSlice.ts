import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, ProductsApiResponse, FetchProductsParams } from "./types";
import { errorLogger } from "@/lib/utils/errorLogger";

// Enhanced base query with error logging
const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  })(args, api, extraOptions);

  // Log errors
  if (result.error) {
    await errorLogger.logApiError(result.error, args.url, args.method || "GET", args.body);
  }

  return result;
};

// Define the API slice using RTK Query
export const productsApiSlice = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithLogging,
  tagTypes: ["Product", "Products"], // Cache tags for invalidation
  endpoints: (builder) => ({
    // Get products with filtering and pagination
    getProducts: builder.query<ProductsApiResponse, FetchProductsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add filters
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }
        if (params.tags && params.tags.length > 0) {
          searchParams.set("tags", params.tags.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        const queryString = searchParams.toString();
        return `products${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Products"],
      // Keep data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get single product by slug
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `products/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
      keepUnusedDataFor: 600, // Keep product details for 10 minutes
    }),

    // Get related products
    getRelatedProducts: builder.query<Product[], { categoryId: string; limit?: number }>({
      query: ({ categoryId, limit = 8 }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("category", categoryId);
        searchParams.set("limit", limit.toString());
        return `products/related?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),

    // Search products
    searchProducts: builder.query<
      ProductsApiResponse,
      { query: string; params?: Omit<FetchProductsParams, "search"> }
    >({
      query: ({ query, params = {} }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("search", query);

        // Add other params
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.category) searchParams.set("category", params.category);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }
        if (params.tags && params.tags.length > 0) {
          searchParams.set("tags", params.tags.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 180, // Keep search results for 3 minutes
    }),

    // Get products by category
    getProductsByCategory: builder.query<
      ProductsApiResponse,
      { categoryId: string; params?: Omit<FetchProductsParams, "category"> }
    >({
      query: ({ categoryId, params = {} }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("category", categoryId);

        // Add other params
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }
        if (params.tags && params.tags.length > 0) {
          searchParams.set("tags", params.tags.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),

    // Get products by brand
    getProductsByBrand: builder.query<
      ProductsApiResponse,
      { brand: string; params?: Omit<FetchProductsParams, "brand"> }
    >({
      query: ({ brand, params = {} }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("brand", brand);

        // Add other params
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }
        if (params.tags && params.tags.length > 0) {
          searchParams.set("tags", params.tags.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),

    // Get products on sale
    getProductsOnSale: builder.query<ProductsApiResponse, FetchProductsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add sale tag
        searchParams.set("tags", "sale");

        // Add other filters
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),

    // Get new products
    getNewProducts: builder.query<
      ProductsApiResponse,
      Omit<FetchProductsParams, "sortBy" | "sortOrder">
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add new tag and sorting
        searchParams.set("tags", "new");
        searchParams.set("sortBy", "created_at");
        searchParams.set("sortOrder", "desc");

        // Add other filters
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }

        return `products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),

    // Get popular products
    getPopularProducts: builder.query<
      ProductsApiResponse,
      Omit<FetchProductsParams, "sortBy" | "sortOrder">
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add sorting by popularity
        searchParams.set("sortBy", "rating");
        searchParams.set("sortOrder", "desc");

        // Add other filters
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.rating) searchParams.set("rating", params.rating.toString());
        if (params.availability && params.availability !== "all") {
          searchParams.set("availability", params.availability);
        }
        if (params.tags && params.tags.length > 0) {
          searchParams.set("tags", params.tags.join(","));
        }

        return `products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
      keepUnusedDataFor: 300,
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByBrandQuery,
  useGetProductsOnSaleQuery,
  useGetNewProductsQuery,
  useGetPopularProductsQuery,
} = productsApiSlice;
