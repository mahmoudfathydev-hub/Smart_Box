import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddProductState, Product, ProductSpecs } from "./types";
import { uploadImages, createProduct } from "./thunks";

const initialProduct: Product = {
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  category_en: "",
  category_ar: "",
  brand_en: "",
  brand_ar: "",
  price: 0,
  discount: 0,
  stock: 0,
  sku: "",
  images_url: [],
  specs_en: {},
  is_active: true,
};

const initialState: AddProductState = {
  product: initialProduct,
  loading: false,
  error: null,
  errors: {},
  success: false,
  uploadingImages: false,
};

const addProductSlice = createSlice({
  name: "addProduct",
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
      action: PayloadAction<{ field: keyof Product; value: any }>,
    ) => {
      (state.product as any)[action.payload.field] = action.payload.value;
    },
    updateSpecs: (
      state,
      action: PayloadAction<{ key: string; value: string }>,
    ) => {
      const { key, value } = action.payload;
      state.product.specs_en[key] = value;
    },
    removeSpec: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      delete state.product.specs_en[key];
    },
    resetForm: (state) => {
      state.product = initialProduct;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setImages: (state, action: PayloadAction<string[]>) => {
      state.product.images_url = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.uploadingImages = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.uploadingImages = false;
        state.product.images_url = [
          ...state.product.images_url,
          ...action.payload,
        ];
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploadingImages = false;
        state.error = action.error.message || "Failed to upload images";
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      });
  },
});

export const {
  updateField,
  updateSpecs,
  removeSpec,
  resetForm,
  setImages,
  setErrors,
  clearErrors,
} = addProductSlice.actions;
export default addProductSlice.reducer;
