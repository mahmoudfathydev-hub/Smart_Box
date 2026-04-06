import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/redux/slices/themeSlice";
import languageReducer from "@/redux/slices/languageSlice";
import addProductReducer from "@/redux/modules/addProduct/slice";
import productsReducer from "@/redux/modules/products/slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    addProduct: addProductReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
