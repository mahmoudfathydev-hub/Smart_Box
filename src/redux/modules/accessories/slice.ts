import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccessoriesState, Accessory, AccessoriesFilters, Pagination } from "./types";

const initialState: AccessoriesState = {
  accessories: [],
  accessoryDetails: null,
  relatedAccessories: [],
  filters: {
    sortBy: "created_at",
    sortOrder: "desc",
    status: "active",
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
  accessoryDetailsLoading: false,
  accessoryDetailsError: null,
  relatedAccessoriesLoading: false,
  relatedAccessoriesError: null,
};

const accessoriesSlice = createSlice({
  name: "accessories",
  initialState,
  reducers: {
    // Update filters
    setFilters: (state, action: PayloadAction<Partial<AccessoriesFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters to default
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear accessories list
    clearAccessories: (state) => {
      state.accessories = [];
      state.pagination = initialState.pagination;
    },

    // Clear accessory details
    clearAccessoryDetails: (state) => {
      state.accessoryDetails = null;
      state.accessoryDetailsError = null;
    },

    // Clear related accessories
    clearRelatedAccessories: (state) => {
      state.relatedAccessories = [];
      state.relatedAccessoriesError = null;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.accessoryDetailsError = null;
      state.relatedAccessoriesError = null;
    },

    // Set pagination page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    // Update accessory in state (for optimistic updates)
    updateAccessory: (state, action: PayloadAction<Accessory>) => {
      const { id } = action.payload;
      const index = state.accessories.findIndex((accessory) => accessory.id === id);
      if (index !== -1) {
        state.accessories[index] = action.payload;
      }
      if (state.accessoryDetails?.id === id) {
        state.accessoryDetails = action.payload;
      }
    },

    // Remove accessory from state
    removeAccessory: (state, action: PayloadAction<string>) => {
      const accessoryId = action.payload;
      state.accessories = state.accessories.filter(
        (accessory) => accessory.id !== accessoryId,
      );
      if (state.accessoryDetails?.id === accessoryId) {
        state.accessoryDetails = null;
      }
      state.relatedAccessories = state.relatedAccessories.filter(
        (accessory) => accessory.id !== accessoryId,
      );
    },

    // Sync accessories from RTK Query (for backward compatibility)
    syncAccessories: (
      state,
      action: PayloadAction<{ accessories: Accessory[]; pagination: Pagination }>,
    ) => {
      state.accessories = action.payload.accessories;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },

    // Sync accessory details from RTK Query
    syncAccessoryDetails: (state, action: PayloadAction<Accessory>) => {
      state.accessoryDetails = action.payload;
      state.accessoryDetailsLoading = false;
      state.accessoryDetailsError = null;
    },

    // Sync related accessories from RTK Query
    syncRelatedAccessories: (state, action: PayloadAction<Accessory[]>) => {
      state.relatedAccessories = action.payload;
      state.relatedAccessoriesLoading = false;
      state.relatedAccessoriesError = null;
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

    // Set accessory details loading
    setAccessoryDetailsLoading: (state, action: PayloadAction<boolean>) => {
      state.accessoryDetailsLoading = action.payload;
    },

    // Set accessory details error
    setAccessoryDetailsError: (state, action: PayloadAction<string | null>) => {
      state.accessoryDetailsError = action.payload;
      state.accessoryDetailsLoading = false;
    },

    // Set related accessories loading
    setRelatedAccessoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.relatedAccessoriesLoading = action.payload;
    },

    // Set related accessories error
    setRelatedAccessoriesError: (state, action: PayloadAction<string | null>) => {
      state.relatedAccessoriesError = action.payload;
      state.relatedAccessoriesLoading = false;
    },
  },
  // Remove extraReducers since we're using RTK Query now
});

export const {
  setFilters,
  resetFilters,
  clearAccessories,
  clearAccessoryDetails,
  clearRelatedAccessories,
  clearErrors,
  setCurrentPage,
  updateAccessory,
  removeAccessory,
  syncAccessories,
  syncAccessoryDetails,
  syncRelatedAccessories,
  setLoading,
  setError,
  setAccessoryDetailsLoading,
  setAccessoryDetailsError,
  setRelatedAccessoriesLoading,
  setRelatedAccessoriesError,
} = accessoriesSlice.actions;

export default accessoriesSlice.reducer;
