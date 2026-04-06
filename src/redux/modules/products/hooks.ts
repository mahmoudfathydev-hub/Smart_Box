import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByBrandQuery,
  useGetProductsOnSaleQuery,
  useGetNewProductsQuery,
  useGetPopularProductsQuery,
} from './apiSlice'
import { FetchProductsParams } from './types'
import { setFilters, setCurrentPage, clearErrors } from './slice'

// Enhanced hook for products with Redux state integration
export const useProducts = (params: FetchProductsParams = {}) => {
  const dispatch = useDispatch()
  
  // Get filters and pagination from Redux state
  const filters = useSelector((state: RootState) => state.products.filters)
  const currentPage = useSelector((state: RootState) => state.products.pagination.currentPage)
  
  // Merge params with Redux state
  const mergedParams = {
    page: currentPage,
    ...filters,
    ...params,
  }

  // Use RTK Query hook with merged params
  const queryResult = useGetProductsQuery(mergedParams)

  // Actions to update Redux state
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters))
    dispatch(setCurrentPage(1)) // Reset to first page when filters change
  }

  const goToPage = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const clearError = () => {
    dispatch(clearErrors())
  }

  return {
    ...queryResult,
    filters,
    currentPage,
    updateFilters,
    goToPage,
    clearError,
  }
}

// Hook for single product
export const useProduct = (slug: string) => {
  return useGetProductBySlugQuery(slug)
}

// Hook for related products
export const useRelatedProducts = (categoryId: string, limit?: number) => {
  return useGetRelatedProductsQuery({ categoryId, limit })
}

// Hook for search functionality
export const useProductSearch = (query: string, params: Omit<FetchProductsParams, 'search'> = {}) => {
  return useSearchProductsQuery({ query, params })
}

// Hook for category products
export const useCategoryProducts = (categoryId: string, params: Omit<FetchProductsParams, 'category'> = {}) => {
  return useGetProductsByCategoryQuery({ categoryId, params })
}

// Hook for brand products
export const useBrandProducts = (brand: string, params: Omit<FetchProductsParams, 'brand'> = {}) => {
  return useGetProductsByBrandQuery({ brand, params })
}

// Hook for sale products
export const useSaleProducts = (params: FetchProductsParams = {}) => {
  return useGetProductsOnSaleQuery(params)
}

// Hook for new products
export const useNewProducts = (params: Omit<FetchProductsParams, 'sortBy' | 'sortOrder'> = {}) => {
  return useGetNewProductsQuery(params)
}

// Hook for popular products
export const usePopularProducts = (params: Omit<FetchProductsParams, 'sortBy' | 'sortOrder'> = {}) => {
  return useGetPopularProductsQuery(params)
}

// Hook for products state (legacy selectors for backward compatibility)
export const useProductsState = () => {
  return useSelector((state: RootState) => state.products)
}

// Selectors for backward compatibility
export const useProductsSelector = () => useSelector((state: RootState) => state.products.products)
export const useProductsLoadingSelector = () => useSelector((state: RootState) => state.products.loading)
export const useProductsErrorSelector = () => useSelector((state: RootState) => state.products.error)
export const useProductsPaginationSelector = () => useSelector((state: RootState) => state.products.pagination)
export const useProductsFiltersSelector = () => useSelector((state: RootState) => state.products.filters)
export const useHasProductsSelector = () => useSelector((state: RootState) => state.products.products.length > 0)
export const useTotalItemsSelector = () => useSelector((state: RootState) => state.products.pagination.totalItems)
export const useCurrentPageSelector = () => useSelector((state: RootState) => state.products.pagination.currentPage)
export const useTotalPagesSelector = () => useSelector((state: RootState) => state.products.pagination.totalPages)
