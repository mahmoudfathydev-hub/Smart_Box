import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/redux/slices/themeSlice";
import languageReducer from "@/redux/slices/languageSlice";
import addProductReducer from "@/redux/modules/addProduct/slice";
import productsReducer from "@/redux/modules/products/slice";
import { productsApiSlice } from "@/redux/modules/products/apiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    addProduct: addProductReducer,
    products: productsReducer,
    // Add RTK Query API reducer
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
  },
  // Add RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(productsApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
