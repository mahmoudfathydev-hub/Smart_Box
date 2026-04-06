import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadImageToCloudinary,
  createProductInSupabase,
  fetchProductsFromSupabase,
} from "./api";
import { Product } from "./types";

export const uploadImages = createAsyncThunk(
  "addProduct/uploadImages",
  async ({ files, productName }: { files: File[]; productName: string }) => {
    const uploadPromises = files.map((file) =>
      uploadImageToCloudinary(file, productName),
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  },
);

export const createProduct = createAsyncThunk(
  "addProduct/createProduct",
  async (product: Omit<Product, "id" | "created_at">) => {
    const data = await createProductInSupabase(product);
    return data;
  },
);

export const fetchProducts = createAsyncThunk(
  "addProduct/fetchProducts",
  async () => {
    const data = await fetchProductsFromSupabase();
    return data;
  },
);
