// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import CryptoJS from "crypto-js";

// Slice imports
import sidebarReducer from "./Slices/sidebarSlice";
import GlobalReducer from "./Slices/GlobalSlice";
import GlobalSaveReducer from "./Slices/GlobalSaveSlice";

// =======================================================================
// 🔐 ENCRYPTION + DECRYPTION TRANSFORM
// =======================================================================

const secretKey = "MY_SECRET_KEY_123";

const encryptDecryptTransform = createTransform(
  (inboundState) => {
    try {
      const stringified = JSON.stringify(inboundState);
      return CryptoJS.AES.encrypt(stringified, secretKey).toString();
    } catch (e) {
      console.error("Encryption error:", e);
      return inboundState;
    }
  },
  (outboundState) => {
    try {
      if (typeof outboundState !== "string") return outboundState;
      const bytes = CryptoJS.AES.decrypt(outboundState, secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      console.error("Decryption error:", e);
      return outboundState;
    }
  }
);

// =======================================================================
// 📌 ONLY PERSIST THIS ONE SLICE → GlobalSaveStore
// =======================================================================

const globalSavePersistConfig = {
  key: "GlobalSaveStore",
  storage,
  whitelist: ["SelectedClient","UserCode"], // persist only this field
  transforms: [encryptDecryptTransform],
};

// Wrap only the slice reducer
const persistedGlobalSaveReducer = persistReducer(
  globalSavePersistConfig,
  GlobalSaveReducer
);

// =======================================================================
// 🧩 ROOT REDUCER (NO PERSIST ON ROOT)
// =======================================================================

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  GlobalStore: GlobalReducer,
  GlobalSaveStore: persistedGlobalSaveReducer, // persisted slice
});

// =======================================================================
// 🏪 STORE CONFIG
// =======================================================================

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env?.VITE_DEVELOPMENT_MODE !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// =======================================================================
// 💾 PERSISTOR
// =======================================================================

export const persistor = persistStore(store);
