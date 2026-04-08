import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { AddAccessoriesState } from "./types";

// Basic selectors
export const selectAddAccessoriesState = (state: RootState) => state.addAccessories as AddAccessoriesState;
export const selectAccessory = (state: RootState) => selectAddAccessoriesState(state).accessory;
export const selectAccessories = (state: RootState) => selectAddAccessoriesState(state).accessories;
export const selectAddAccessoriesLoading = (state: RootState) => selectAddAccessoriesState(state).loading;
export const selectAddAccessoriesError = (state: RootState) => selectAddAccessoriesState(state).error;
export const selectAddAccessoriesErrors = (state: RootState) => selectAddAccessoriesState(state).errors;
export const selectAddAccessoriesSuccess = (state: RootState) => selectAddAccessoriesState(state).success;
export const selectUploadingImages = (state: RootState) => selectAddAccessoriesState(state).uploadingImages;
export const selectFetchingAccessories = (state: RootState) => selectAddAccessoriesState(state).fetchingAccessories;

// Derived selectors
export const selectAccessoryFormData = createSelector(
  [selectAccessory],
  (accessory) => ({
    name_en: accessory.name_en,
    name_ar: accessory.name_ar,
    description_en: accessory.description_en,
    description_ar: accessory.description_ar,
    type: accessory.type,
    brand_en: accessory.brand_en,
    brand_ar: accessory.brand_ar,
    price: accessory.price,
    discount: accessory.discount,
    stock_quantity: accessory.stock_quantity,
    sku: accessory.sku,
    image_url: accessory.image_url,
    compatible_devices: accessory.compatible_devices,
    is_active: accessory.is_active,
  })
);

export const selectHasFormErrors = createSelector(
  [selectAddAccessoriesErrors],
  (errors) => Object.keys(errors).length > 0
);

export const selectIsFormValid = createSelector(
  [selectAccessory, selectAddAccessoriesErrors],
  (accessory, errors) => {
    return (
      accessory.name_en.trim() !== "" &&
      accessory.name_ar.trim() !== "" &&
      accessory.brand_en.trim() !== "" &&
      accessory.brand_ar.trim() !== "" &&
      accessory.type.trim() !== "" &&
      accessory.price > 0 &&
      accessory.stock_quantity >= 0 &&
      Object.keys(errors).length === 0
    );
  }
);
