import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ProductsState,
  Product,
  ProductsFilters,
  Pagination,
  ProductsApiResponse,
} from './types';
import {
  fetchProducts,
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchProductsByCategory,
  searchProducts,
  fetchProductsByBrand,
  fetchProductsOnSale,
  fetchNewProducts,
  fetchPopularProducts,
} from './thunks';

const initialState: ProductsState = {
  products: [],
  productDetails: null,
  relatedProducts: [],
  filters: {
    sortBy: 'created_at',
    sortOrder: 'desc',
    availability: 'all',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  productDetailsLoading: false,
  productDetailsError: null,
  relatedProductsLoading: false,
  relatedProductsError: null,
};

const productsSlice = createSlice({
  name: 'products',
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
      const index = state.products.findIndex(product => product.id === id);
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
      state.products = state.products.filter(product => product.id !== productId);
      if (state.productDetails?.id === productId) {
        state.productDetails = null;
      }
      state.relatedProducts = state.relatedProducts.filter(product => product.id !== productId);
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProductBySlug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.productDetailsLoading = true;
        state.productDetailsError = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action: PayloadAction<Product>) => {
        state.productDetailsLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.productDetailsLoading = false;
        state.productDetailsError = action.payload as string;
      });

    // fetchRelatedProducts
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedProductsLoading = true;
        state.relatedProductsError = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.relatedProductsLoading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedProductsLoading = false;
        state.relatedProductsError = action.payload as string;
      });

    // fetchProductsByCategory
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // searchProducts
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProductsByBrand
    builder
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProductsOnSale
    builder
      .addCase(fetchProductsOnSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsOnSale.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(fetchProductsOnSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchNewProducts
    builder
      .addCase(fetchNewProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewProducts.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchPopularProducts
    builder
      .addCase(fetchPopularProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action: PayloadAction<ProductsApiResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = { ...state.filters, ...action.payload.filters };
      })
      .addCase(fetchPopularProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
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
} = productsSlice.actions;

export default productsSlice.reducer;
