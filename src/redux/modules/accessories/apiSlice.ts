import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Accessory, AccessoriesApiResponse, FetchAccessoriesParams } from "./types";
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
export const accessoriesApiSlice = createApi({
  reducerPath: "accessoriesApi",
  baseQuery: baseQueryWithLogging,
  tagTypes: ["Accessory", "Accessories"], // Cache tags for invalidation
  endpoints: (builder) => ({
    // Get accessories with filtering and pagination
    getAccessories: builder.query<AccessoriesApiResponse, FetchAccessoriesParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add filters
        if (params.search) searchParams.set("search", params.search);
        if (params.type) searchParams.set("type", params.type);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.status && params.status !== "all") {
          searchParams.set("status", params.status);
        }
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        const queryString = searchParams.toString();
        return `accessories${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Accessories"],
      // Keep data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get single accessory by slug
    getAccessoryBySlug: builder.query<Accessory, string>({
      query: (slug) => `accessories/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Accessory", id: slug }],
      keepUnusedDataFor: 600, // Keep accessory details for 10 minutes
    }),

    // Get related accessories
    getRelatedAccessories: builder.query<Accessory[], { typeId: string; limit?: number }>({
      query: ({ typeId, limit = 8 }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("type", typeId);
        searchParams.set("limit", limit.toString());
        return `accessories/related?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 300,
    }),

    // Search accessories
    searchAccessories: builder.query<
      AccessoriesApiResponse,
      { query: string; params?: Omit<FetchAccessoriesParams, "search"> }
    >({
      query: ({ query, params = {} }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("search", query);

        // Add other params
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.type) searchParams.set("type", params.type);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.status && params.status !== "all") {
          searchParams.set("status", params.status);
        }
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `accessories?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 180, // Keep search results for 3 minutes
    }),

    // Get accessories by type
    getAccessoriesByType: builder.query<
      AccessoriesApiResponse,
      { typeId: string; params?: Omit<FetchAccessoriesParams, "type"> }
    >({
      query: ({ typeId, params = {} }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("type", typeId);

        // Add other params
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.status && params.status !== "all") {
          searchParams.set("status", params.status);
        }
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `accessories?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 300,
    }),

    // Get accessories by brand
    getAccessoriesByBrand: builder.query<
      AccessoriesApiResponse,
      { brand: string; params?: Omit<FetchAccessoriesParams, "brand"> }
    >({
      query: ({ brand, params = {} }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("brand", brand);

        // Add other params
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.type) searchParams.set("type", params.type);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.status && params.status !== "all") {
          searchParams.set("status", params.status);
        }
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `accessories?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 300,
    }),

    // Get accessories on sale
    getAccessoriesOnSale: builder.query<AccessoriesApiResponse, FetchAccessoriesParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add sale filter
        searchParams.set("status", "sale");

        // Add other filters
        if (params.search) searchParams.set("search", params.search);
        if (params.type) searchParams.set("type", params.type);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

        return `accessories?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 300,
    }),

    // Get new accessories
    getNewAccessories: builder.query<
      AccessoriesApiResponse,
      Omit<FetchAccessoriesParams, "sortBy" | "sortOrder">
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());

        // Add sorting by creation date
        searchParams.set("sortBy", "created_at");
        searchParams.set("sortOrder", "desc");

        // Add other filters
        if (params.search) searchParams.set("search", params.search);
        if (params.type) searchParams.set("type", params.type);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.status && params.status !== "all") {
          searchParams.set("status", params.status);
        }
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }

        return `accessories?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 300,
    }),

    // Get popular accessories
    getPopularAccessories: builder.query<
      AccessoriesApiResponse,
      Omit<FetchAccessoriesParams, "sortBy" | "sortOrder">
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
        if (params.type) searchParams.set("type", params.type);
        if (params.brand) searchParams.set("brand", params.brand);
        if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.status && params.status !== "all") {
          searchParams.set("status", params.status);
        }
        if (params.compatibleDevices && params.compatibleDevices.length > 0) {
          searchParams.set("compatibleDevices", params.compatibleDevices.join(","));
        }
        if (params.tags && params.tags.length > 0) {
          searchParams.set("tags", params.tags.join(","));
        }

        return `accessories?${searchParams.toString()}`;
      },
      providesTags: ["Accessories"],
      keepUnusedDataFor: 300,
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useGetAccessoriesQuery,
  useGetAccessoryBySlugQuery,
  useGetRelatedAccessoriesQuery,
  useSearchAccessoriesQuery,
  useGetAccessoriesByTypeQuery,
  useGetAccessoriesByBrandQuery,
  useGetAccessoriesOnSaleQuery,
  useGetNewAccessoriesQuery,
  useGetPopularAccessoriesQuery,
} = accessoriesApiSlice;
