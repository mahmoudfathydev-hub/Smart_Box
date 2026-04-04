import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/redux/slices/themeSlice";
import languageReducer from "@/redux/slices/languageSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
  },
});
