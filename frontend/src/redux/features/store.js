import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import favoriteReducer from "../features/favourites/favoriteSlice";
import cartReducer from "../features/cart/cartSlice"; // ← add this import
import { getFavoritesFromLocalStorage } from "../../utils/localstorage";
import shopReducer from "../features/shop/shopSlice"; // ← add this import

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoriteReducer,
    cart: cartReducer, // ← uncomment and fix this
    shop: shopReducer, // ← add this line
  },
  preloadedState: {
    favorites: initialFavorites,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;