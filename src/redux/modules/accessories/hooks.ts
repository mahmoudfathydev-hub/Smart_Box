import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  useGetAccessoriesQuery,
  useGetAccessoryBySlugQuery,
  useGetRelatedAccessoriesQuery,
  useSearchAccessoriesQuery,
  useGetAccessoriesByTypeQuery,
  useGetAccessoriesByBrandQuery,
  useGetAccessoriesOnSaleQuery,
  useGetNewAccessoriesQuery,
  useGetPopularAccessoriesQuery,
} from './apiSlice'
import { FetchAccessoriesParams } from './types'
import { setFilters, setCurrentPage, clearErrors } from './slice'

// Enhanced hook for accessories with Redux state integration
export const useAccessories = (params: FetchAccessoriesParams = {}) => {
  const dispatch = useDispatch()
  
  // Get filters and pagination from Redux state
  const filters = useSelector((state: RootState) => state.accessories.filters)
  const currentPage = useSelector((state: RootState) => state.accessories.pagination.currentPage)
  
  // Merge params with Redux state
  const mergedParams = {
    page: currentPage,
    ...filters,
    ...params,
  }

  // Use RTK Query hook with merged params
  const queryResult = useGetAccessoriesQuery(mergedParams)

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

// Hook for single accessory
export const useAccessory = (slug: string) => {
  return useGetAccessoryBySlugQuery(slug)
}

// Hook for related accessories
export const useRelatedAccessories = (typeId: string, limit?: number) => {
  return useGetRelatedAccessoriesQuery({ typeId, limit })
}

// Hook for search functionality
export const useAccessorySearch = (query: string, params: Omit<FetchAccessoriesParams, 'search'> = {}) => {
  return useSearchAccessoriesQuery({ query, params })
}

// Hook for type accessories
export const useTypeAccessories = (typeId: string, params: Omit<FetchAccessoriesParams, 'type'> = {}) => {
  return useGetAccessoriesByTypeQuery({ typeId, params })
}

// Hook for brand accessories
export const useBrandAccessories = (brand: string, params: Omit<FetchAccessoriesParams, 'brand'> = {}) => {
  return useGetAccessoriesByBrandQuery({ brand, params })
}

// Hook for sale accessories
export const useSaleAccessories = (params: FetchAccessoriesParams = {}) => {
  return useGetAccessoriesOnSaleQuery(params)
}

// Hook for new accessories
export const useNewAccessories = (params: Omit<FetchAccessoriesParams, 'sortBy' | 'sortOrder'> = {}) => {
  return useGetNewAccessoriesQuery(params)
}

// Hook for popular accessories
export const usePopularAccessories = (params: Omit<FetchAccessoriesParams, 'sortBy' | 'sortOrder'> = {}) => {
  return useGetPopularAccessoriesQuery(params)
}

// Hook for accessories state (legacy selectors for backward compatibility)
export const useAccessoriesState = () => {
  return useSelector((state: RootState) => state.accessories)
}

// Selectors for backward compatibility
export const useAccessoriesSelector = () => useSelector((state: RootState) => state.accessories.accessories)
export const useAccessoriesLoadingSelector = () => useSelector((state: RootState) => state.accessories.loading)
export const useAccessoriesErrorSelector = () => useSelector((state: RootState) => state.accessories.error)
export const useAccessoriesPaginationSelector = () => useSelector((state: RootState) => state.accessories.pagination)
export const useAccessoriesFiltersSelector = () => useSelector((state: RootState) => state.accessories.filters)
export const useHasAccessoriesSelector = () => useSelector((state: RootState) => state.accessories.accessories.length > 0)
export const useTotalItemsSelector = () => useSelector((state: RootState) => state.accessories.pagination.totalItems)
export const useCurrentPageSelector = () => useSelector((state: RootState) => state.accessories.pagination.currentPage)
export const useTotalPagesSelector = () => useSelector((state: RootState) => state.accessories.pagination.totalPages)
