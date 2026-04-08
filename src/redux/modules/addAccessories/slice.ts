import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddAccessoriesState, Accessory, AccessorySpecs } from "./types";
import { uploadImages, createAccessory, fetchAccessories } from "./thunks";

const initialAccessory: Accessory = {
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  type: "",
  brand_en: "",
  brand_ar: "",
  price: 0,
  discount: 0,
  stock_quantity: 0,
  sku: "",
  image_url: "",
  compatible_devices: [],
  is_active: true,
};

const initialState: AddAccessoriesState = {
  accessory: initialAccessory,
  accessories: [],
  loading: false,
  error: null,
  errors: {},
  success: false,
  uploadingImages: false,
  fetchingAccessories: false,
};

const addAccessoriesSlice = createSlice({
  name: "addAccessories",
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    updateField: (
      state,
      action: PayloadAction<{ field: keyof Accessory; value: any }>,
    ) => {
      (state.accessory as any)[action.payload.field] = action.payload.value;
    },
    updateSpecs: (
      state,
      action: PayloadAction<{ key: string; value: string }>,
    ) => {
      // Note: Accessories don't have specs in the current structure
      // This is kept for consistency with the product structure
    },
    resetForm: (state) => {
      state.accessory = initialAccessory;
      state.errors = {};
      state.success = false;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create accessory
      .addCase(createAccessory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errors = {};
      })
      .addCase(createAccessory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.accessories.push(action.payload);
      })
      .addCase(createAccessory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (action.payload && typeof action.payload === 'object') {
          state.errors = action.payload as Record<string, string>;
        }
      })
      // Upload images
      .addCase(uploadImages.pending, (state) => {
        state.uploadingImages = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.uploadingImages = false;
        state.accessory.image_url = action.payload[0]; // Take first image
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploadingImages = false;
        state.error = action.payload as string;
      })
      // Fetch accessories
      .addCase(fetchAccessories.pending, (state) => {
        state.fetchingAccessories = true;
        state.error = null;
      })
      .addCase(fetchAccessories.fulfilled, (state, action) => {
        state.fetchingAccessories = false;
        state.accessories = action.payload;
      })
      .addCase(fetchAccessories.rejected, (state, action) => {
        state.fetchingAccessories = false;
        state.error = action.payload as string;
      });
  },
});

export const { setErrors, clearErrors, updateField, updateSpecs, resetForm, setSuccess } = addAccessoriesSlice.actions;
export default addAccessoriesSlice.reducer;
