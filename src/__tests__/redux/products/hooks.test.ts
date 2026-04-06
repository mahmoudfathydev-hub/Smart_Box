import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useProducts, useProduct, useProductSearch } from "@/redux/modules/products/hooks";
import { productsApiSlice } from "@/redux/modules/products/apiSlice";
import productsReducer from "@/redux/modules/products/slice";
import languageReducer from "@/redux/slices/languageSlice";
import themeReducer from "@/redux/slices/themeSlice";
import { mockApiResponse, mockProducts } from "@/__mocks__/products";

// Mock the API slice
jest.mock("@/redux/modules/products/apiSlice", () => ({
  productsApiSlice: {
    reducer: {
      getProducts: jest.fn(),
    },
    useGetProductsQuery: jest.fn(),
    useGetProductBySlugQuery: jest.fn(),
    useSearchProductsQuery: jest.fn(),
    reducerPath: "productsApi",
    middleware: jest.fn(),
  },
  useGetProductsQuery: jest.fn(),
  useGetProductBySlugQuery: jest.fn(),
  useSearchProductsQuery: jest.fn(),
}));

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      language: languageReducer,
      products: productsReducer,
      [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(productsApiSlice.middleware),
    preloadedState: initialState,
  });
};

// Helper function to render hook with provider
const renderHookWithProvider = (hook: () => any, initialState = {}) => {
  const store = createTestStore(initialState);

  return renderHook(hook, {
    wrapper: ({ children }) => React.createElement(Provider, { store, children }),
  });
};

describe("Products Hooks", () => {
  const mockUseGetProductsQuery = jest.mocked(
    require("@/redux/modules/products/apiSlice").useGetProductsQuery,
  );
  const mockUseGetProductBySlugQuery = jest.mocked(
    require("@/redux/modules/products/apiSlice").useGetProductBySlugQuery,
  );
  const mockUseSearchProductsQuery = jest.mocked(
    require("@/redux/modules/products/apiSlice").useSearchProductsQuery,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useProducts", () => {
    it("should return products data and actions", async () => {
      const mockRefetch = jest.fn();
      mockUseGetProductsQuery.mockReturnValue({
        data: mockApiResponse,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      } as any);

      const hookResult = renderHookWithProvider(() => useProducts());

      await waitFor(() => {
        expect(hookResult.result.current.data).toEqual(mockApiResponse);
        expect(hookResult.result.current.isLoading).toBe(false);
        expect(hookResult.result.current.error).toBe(null);
        expect(hookResult.result.current.products).toEqual(mockProducts);
        expect(hookResult.result.current.totalItems).toBe(mockProducts.length);
        expect(hookResult.result.current.totalPages).toBe(1);
        expect(hookResult.result.current.currentPage).toBe(1);
      });

      expect(typeof hookResult.result.current.updateFilters).toBe("function");
      expect(typeof hookResult.result.current.goToPage).toBe("function");
      expect(typeof hookResult.result.current.clearError).toBe("function");
      expect(typeof hookResult.result.current.refetch).toBe("function");
    });

    it("should merge Redux state with hook parameters", async () => {
      const initialState = {
        products: {
          filters: {
            category: "electronics",
            brand: "Apple",
          },
          pagination: {
            currentPage: 2,
          },
        },
      };

      mockUseGetProductsQuery.mockReturnValue({
        data: mockApiResponse,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      renderHookWithProvider(() => useProducts({ limit: 20 }), initialState);

      await waitFor(() => {
        expect(mockUseGetProductsQuery).toHaveBeenCalledWith({
          page: 2,
          limit: 20,
          category: "electronics",
          brand: "Apple",
        });
      });
    });

    it("should handle loading state", () => {
      mockUseGetProductsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      } as any);

      const hookResult = renderHookWithProvider(() => useProducts());

      expect(hookResult.result.current.isLoading).toBe(true);
      expect(hookResult.result.current.data).toBeUndefined();
    });

    it("should handle error state", () => {
      const errorMessage = "Failed to fetch products";
      mockUseGetProductsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: errorMessage },
        refetch: jest.fn(),
      } as any);

      const hookResult = renderHookWithProvider(() => useProducts());

      expect(hookResult.result.current.error).toEqual({ message: errorMessage });
    });
  });

  describe("useProduct", () => {
    it("should return single product data", async () => {
      const mockProduct = mockProducts[0];
      mockUseGetProductBySlugQuery.mockReturnValue({
        data: mockProduct,
        isLoading: false,
        error: null,
      } as any);

      const hookResult = renderHookWithProvider(() => useProduct("test-product-1"));

      await waitFor(() => {
        expect(hookResult.result.current.data).toEqual(mockProduct);
        expect(hookResult.result.current.isLoading).toBe(false);
        expect(hookResult.result.current.error).toBe(null);
      });
    });

    it("should handle product not found", () => {
      mockUseGetProductBySlugQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: "Product not found" },
      } as any);

      const hookResult = renderHookWithProvider(() => useProduct("non-existent"));

      expect(hookResult.result.current.error).toEqual({ message: "Product not found" });
    });
  });

  describe("useProductSearch", () => {
    it("should return search results", async () => {
      const searchResults = mockProducts.slice(0, 2);
      mockUseSearchProductsQuery.mockReturnValue({
        data: { ...mockApiResponse, products: searchResults },
        isLoading: false,
        error: null,
      } as any);

      const hookResult = renderHookWithProvider(() => useProductSearch("laptop"));

      await waitFor(() => {
        expect(hookResult.result.current.data?.products).toEqual(searchResults);
        expect(hookResult.result.current.isLoading).toBe(false);
      });

      expect(mockUseSearchProductsQuery).toHaveBeenCalledWith({
        query: "laptop",
        params: {},
      });
    });

    it("should pass search parameters correctly", async () => {
      mockUseSearchProductsQuery.mockReturnValue({
        data: mockApiResponse,
        isLoading: false,
        error: null,
      } as any);

      const searchParams = { category: "electronics", limit: 10 };
      renderHookWithProvider(() => useProductSearch("laptop", searchParams));

      await waitFor(() => {
        expect(mockUseSearchProductsQuery).toHaveBeenCalledWith({
          query: "laptop",
          params: searchParams,
        });
      });
    });
  });
});
