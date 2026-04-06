import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from './api';
import { FetchProductsParams } from './types';

// Fetch products with filters and pagination
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: FetchProductsParams = {}, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch products'
      );
    }
  }
);

// Fetch single product by slug
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductBySlug(slug);
      return response.product;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch product'
      );
    }
  }
);

// Fetch related products for a given category
export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async ({ categoryId, limit }: { categoryId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await productsApi.getRelatedProducts(categoryId, limit);
      return response.products;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch related products'
      );
    }
  }
);

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, params }: { categoryId: string; params?: Omit<FetchProductsParams, 'category'> }, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductsByCategory(categoryId, params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch products by category'
      );
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, params }: { query: string; params?: Omit<FetchProductsParams, 'search'> }, { rejectWithValue }) => {
    try {
      const response = await productsApi.searchProducts(query, params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to search products'
      );
    }
  }
);

// Fetch products by brand
export const fetchProductsByBrand = createAsyncThunk(
  'products/fetchProductsByBrand',
  async ({ brand, params }: { brand: string; params?: Omit<FetchProductsParams, 'brand'> }, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductsByBrand(brand, params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch products by brand'
      );
    }
  }
);

// Fetch products on sale
export const fetchProductsOnSale = createAsyncThunk(
  'products/fetchProductsOnSale',
  async (params: FetchProductsParams = {}, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductsOnSale(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch products on sale'
      );
    }
  }
);

// Fetch new products
export const fetchNewProducts = createAsyncThunk(
  'products/fetchNewProducts',
  async (params: FetchProductsParams = {}, { rejectWithValue }) => {
    try {
      const response = await productsApi.getNewProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch new products'
      );
    }
  }
);

// Fetch popular products
export const fetchPopularProducts = createAsyncThunk(
  'products/fetchPopularProducts',
  async (params: FetchProductsParams = {}, { rejectWithValue }) => {
    try {
      const response = await productsApi.getPopularProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch popular products'
      );
    }
  }
);
