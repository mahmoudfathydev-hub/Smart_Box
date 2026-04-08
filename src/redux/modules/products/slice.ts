import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductsState, Product, ProductsFilters, Pagination } from "./types";

const initialState: ProductsState = {
  products: [],
  productDetails: null,
  relatedProducts: [],
  filters: {
    sortBy: "created_at",
    sortOrder: "desc",
    availability: "all",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  loading: false,
  error: null,
  productDetailsLoading: false,
  productDetailsError: null,
  relatedProductsLoading: false,
  relatedProductsError: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Update filters
    setFilters: (state, action: PayloadAction<Partial<ProductsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters to default
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear products list
    clearProducts: (state) => {
      state.products = [];
      state.pagination = initialState.pagination;
    },

    // Clear product details
    clearProductDetails: (state) => {
      state.productDetails = null;
      state.productDetailsError = null;
    },

    // Clear related products
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
      state.relatedProductsError = null;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.productDetailsError = null;
      state.relatedProductsError = null;
    },

    // Set pagination page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    // Update product in state (for optimistic updates)
    updateProduct: (state, action: PayloadAction<Product>) => {
      const { id } = action.payload;
      const index = state.products.findIndex((product) => product.id === id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.productDetails?.id === id) {
        state.productDetails = action.payload;
      }
    },

    // Remove product from state
    removeProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.products = state.products.filter((product) => product.id !== productId);
      if (state.productDetails?.id === productId) {
        state.productDetails = null;
      }
      state.relatedProducts = state.relatedProducts.filter((product) => product.id !== productId);
    },

    // Sync products from RTK Query (for backward compatibility)
    syncProducts: (
      state,
      action: PayloadAction<{ products: Product[]; pagination: Pagination }>,
    ) => {
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },

    // Sync product details from RTK Query
    syncProductDetails: (state, action: PayloadAction<Product>) => {
      state.productDetails = action.payload;
      state.productDetailsLoading = false;
      state.productDetailsError = null;
    },

    // Sync related products from RTK Query
    syncRelatedProducts: (state, action: PayloadAction<Product[]>) => {
      state.relatedProducts = action.payload;
      state.relatedProductsLoading = false;
      state.relatedProductsError = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Set product details loading
    setProductDetailsLoading: (state, action: PayloadAction<boolean>) => {
      state.productDetailsLoading = action.payload;
    },

    // Set product details error
    setProductDetailsError: (state, action: PayloadAction<string | null>) => {
      state.productDetailsError = action.payload;
      state.productDetailsLoading = false;
    },

    // Set related products loading
    setRelatedProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.relatedProductsLoading = action.payload;
    },

    // Set related products error
    setRelatedProductsError: (state, action: PayloadAction<string | null>) => {
      state.relatedProductsError = action.payload;
      state.relatedProductsLoading = false;
    },
  },
  // Remove extraReducers since we're using RTK Query now
});

export const {
  setFilters,
  resetFilters,
  clearProducts,
  clearProductDetails,
  clearRelatedProducts,
  clearErrors,
  setCurrentPage,
  updateProduct,
  removeProduct,
  syncProducts,
  syncProductDetails,
  syncRelatedProducts,
  setLoading,
  setError,
  setProductDetailsLoading,
  setProductDetailsError,
  setRelatedProductsLoading,
  setRelatedProductsError,
} = productsSlice.actions;

export default productsSlice.reducer;
