import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Product, ProductsFilters, Pagination } from "./types";

// Basic selectors
export const selectProductsState = (state: RootState) => state.products;
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductDetails = (state: RootState) =>
  state.products.productDetails;
export const selectRelatedProducts = (state: RootState) =>
  state.products.relatedProducts;
export const selectProductsFilters = (state: RootState) =>
  state.products.filters;
export const selectProductsPagination = (state: RootState) =>
  state.products.pagination;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductDetailsLoading = (state: RootState) =>
  state.products.productDetailsLoading;
export const selectProductDetailsError = (state: RootState) =>
  state.products.productDetailsError;
export const selectRelatedProductsLoading = (state: RootState) =>
  state.products.relatedProductsLoading;
export const selectRelatedProductsError = (state: RootState) =>
  state.products.relatedProductsError;

// Computed selectors
export const selectProductsCount = createSelector(
  [selectProducts],
  (products) => products.length,
);

export const selectHasProducts = createSelector(
  [selectProductsCount],
  (count) => count > 0,
);

export const selectCurrentPage = createSelector(
  [selectProductsPagination],
  (pagination) => pagination.currentPage,
);

export const selectTotalPages = createSelector(
  [selectProductsPagination],
  (pagination) => pagination.totalPages,
);

export const selectTotalItems = createSelector(
  [selectProductsPagination],
  (pagination) => pagination.totalItems,
);

export const selectHasNextPage = createSelector(
  [selectProductsPagination],
  (pagination) => pagination.hasNextPage,
);

export const selectHasPrevPage = createSelector(
  [selectProductsPagination],
  (pagination) => pagination.hasPrevPage,
);

export const selectItemsPerPage = createSelector(
  [selectProductsPagination],
  (pagination) => pagination.itemsPerPage,
);

export const selectIsFirstPage = createSelector(
  [selectCurrentPage],
  (currentPage) => currentPage === 1,
);

export const selectIsLastPage = createSelector(
  [selectCurrentPage, selectTotalPages],
  (currentPage, totalPages) => currentPage === totalPages,
);

// Filter-related selectors
export const selectActiveFiltersCount = createSelector(
  [selectProductsFilters],
  (filters) => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.rating !== undefined) count++;
    if (filters.availability && filters.availability !== "all") count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  },
);

export const selectHasActiveFilters = createSelector(
  [selectActiveFiltersCount],
  (count) => count > 0,
);

export const selectSearchQuery = createSelector(
  [selectProductsFilters],
  (filters) => filters.search || "",
);

export const selectSelectedCategory = createSelector(
  [selectProductsFilters],
  (filters) => filters.category,
);

export const selectSelectedBrand = createSelector(
  [selectProductsFilters],
  (filters) => filters.brand,
);

export const selectPriceRange = createSelector(
  [selectProductsFilters],
  (filters) => ({
    min: filters.minPrice,
    max: filters.maxPrice,
  }),
);

export const selectSelectedRating = createSelector(
  [selectProductsFilters],
  (filters) => filters.rating,
);

export const selectSelectedAvailability = createSelector(
  [selectProductsFilters],
  (filters) => filters.availability || "all",
);

export const selectSortOptions = createSelector(
  [selectProductsFilters],
  (filters) => ({
    sortBy: filters.sortBy || "created_at",
    sortOrder: filters.sortOrder || "desc",
  }),
);

// Product-related selectors
export const selectProductById = createSelector(
  [selectProducts, (state: RootState, productId: string) => productId],
  (products, productId) => products.find((product) => product.id === productId),
);

export const selectProductBySlug = createSelector(
  [selectProducts, (state: RootState, slug: string) => slug],
  (products, slug) => products.find((product) => product.slug === slug),
);

export const selectProductsByCategory = createSelector(
  [selectProducts, (state: RootState, categoryId: string) => categoryId],
  (products: Product[], categoryId: string) =>
    products.filter((product: Product) => product.categoryId === categoryId),
);

export const selectProductsByBrand = createSelector(
  [selectProducts, (state: RootState, brand: string) => brand],
  (products: Product[], brand: string) =>
    products.filter((product: Product) => product.brand === brand),
);

export const selectInStockProducts = createSelector(
  [selectProducts],
  (products: Product[]) =>
    products.filter((product: Product) => product.stockQuantity > 0),
);

export const selectOutOfStockProducts = createSelector(
  [selectProducts],
  (products: Product[]) =>
    products.filter((product: Product) => product.stockQuantity === 0),
);

export const selectProductsOnSale = createSelector(
  [selectProducts],
  (products: Product[]) =>
    products.filter(
      (product: Product) =>
        product.discountPrice && product.discountPrice < product.price,
    ),
);

export const selectNewProducts = createSelector(
  [selectProducts],
  (products: Product[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return products.filter(
      (product: Product) => new Date(product.createdAt) > thirtyDaysAgo,
    );
  },
);

export const selectHighRatedProducts = createSelector(
  [selectProducts],
  (products: Product[]) =>
    products.filter((product: Product) => product.rating >= 4.0),
);

// Price range selectors
export const selectProductsPriceRange = createSelector(
  [selectProducts],
  (products: Product[]) => {
    if (products.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = products.map(
      (product: Product) => product.discountPrice || product.price,
    );
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },
);

export const selectAverageProductPrice = createSelector(
  [selectProducts],
  (products: Product[]) => {
    if (products.length === 0) return 0;
    const prices = products.map(
      (product: Product) => product.discountPrice || product.price,
    );
    return (
      prices.reduce((sum: number, price: number) => sum + price, 0) /
      prices.length
    );
  },
);

// Loading state selectors
export const selectAnyLoading = createSelector(
  [
    selectProductsLoading,
    selectProductDetailsLoading,
    selectRelatedProductsLoading,
  ],
  (productsLoading, productDetailsLoading, relatedProductsLoading) =>
    productsLoading || productDetailsLoading || relatedProductsLoading,
);

export const selectAnyError = createSelector(
  [selectProductsError, selectProductDetailsError, selectRelatedProductsError],
  (productsError, productDetailsError, relatedProductsError) =>
    productsError || productDetailsError || relatedProductsError,
);

// Breadcrumb selector for product details
export const selectProductBreadcrumb = createSelector(
  [selectProductDetails],
  (product) => {
    if (!product) return [];

    return [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      {
        name: product.brand,
        href: `/products?brand=${encodeURIComponent(product.brand)}`,
      },
      { name: product.name, href: `/products/product/${product.slug}` },
    ];
  },
);

// SEO selectors
export const selectProductsPageTitle = createSelector(
  [selectProductsFilters, selectProductsPagination],
  (filters, pagination) => {
    const baseTitle = "Products";
    const page =
      pagination.currentPage > 1 ? ` - Page ${pagination.currentPage}` : "";

    if (filters.category) {
      return `${filters.category} ${baseTitle}${page}`;
    }

    if (filters.brand) {
      return `${filters.brand} ${baseTitle}${page}`;
    }

    if (filters.search) {
      return `Search Results for "${filters.search}"${page}`;
    }

    return `${baseTitle}${page}`;
  },
);

export const selectProductPageTitle = createSelector(
  [selectProductDetails],
  (product) => {
    if (!product) return "Product Details";
    return `${product.name} - ${product.brand}`;
  },
);

export const selectProductPageDescription = createSelector(
  [selectProductDetails],
  (product) => {
    if (!product) return "";
    return product.shortDescription || product.description.substring(0, 160);
  },
);
