import { createAsyncThunk } from "@reduxjs/toolkit";
import { Accessory } from "./types";

// Upload images thunk
export const uploadImages = createAsyncThunk(
  "addAccessories/uploadImages",
  async (files: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      return data.urls;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Upload failed");
    }
  },
);

// Create accessory thunk
export const createAccessory = createAsyncThunk(
  "addAccessories/createAccessory",
  async (accessory: Accessory, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/accessories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accessory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.errors || "Failed to create accessory");
      }

      const data = await response.json();
      return data.accessory;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Creation failed");
    }
  },
);

// Fetch accessories thunk
export const fetchAccessories = createAsyncThunk(
  "addAccessories/fetchAccessories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/accessories");

      if (!response.ok) {
        throw new Error("Failed to fetch accessories");
      }

      const data = await response.json();
      return data.accessories;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Fetch failed");
    }
  },
);
