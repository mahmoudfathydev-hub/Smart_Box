import { RootState } from "../../store";
import { Product } from "./types";

export const selectProduct = (state: RootState): Product =>
  state.addProduct.product;
export const selectProducts = (state: RootState): Product[] =>
  state.addProduct.products;
export const selectAddProductLoading = (state: RootState): boolean =>
  state.addProduct.loading;
export const selectAddProductError = (state: RootState): string | null =>
  state.addProduct.error;
export const selectAddProductErrors = (
  state: RootState,
): Record<string, string> => state.addProduct.errors;
export const selectAddProductSuccess = (state: RootState): boolean =>
  state.addProduct.success;
export const selectUploadingImages = (state: RootState): boolean =>
  state.addProduct.uploadingImages;
export const selectFetchingProducts = (state: RootState): boolean =>
  state.addProduct.fetchingProducts;
