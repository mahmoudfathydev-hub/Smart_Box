import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/redux/slices/themeSlice";
import languageReducer from "@/redux/slices/languageSlice";
import authReducer from "@/redux/slices/authSlice";
import addProductReducer from "@/redux/modules/addProduct/slice";
import productsReducer from "@/redux/modules/products/slice";
import { productsApiSlice } from "@/redux/modules/products/apiSlice";
import accessoriesReducer from "@/redux/modules/accessories/slice";
import { accessoriesApiSlice } from "@/redux/modules/accessories/apiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    auth: authReducer,
    addProduct: addProductReducer,
    products: productsReducer,
    accessories: accessoriesReducer,
    // Add RTK Query API reducers
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    [accessoriesApiSlice.reducerPath]: accessoriesApiSlice.reducer,
  },
  // Add RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(productsApiSlice.middleware, accessoriesApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
