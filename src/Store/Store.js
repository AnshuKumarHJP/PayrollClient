// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";

import storageSession from "redux-persist/lib/storage/session"; // ✅ FIXED
import CryptoJS from "crypto-js";

// Slices
import GlobalReducer from "./Slices/GlobalSlice";
import authReducer from "./Auth/AuhtSlice";
import { FormBuilder_Reducer } from "./FormBuilder/FormBuilderSlice";

// =============================================================
// ENCRYPTION TRANSFORM
// =============================================================

const secretKey = "MY_SECRET_KEY_123";

const encryptDecryptTransform = createTransform(
  (inboundState) => {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(inboundState),
        secretKey
      ).toString();
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

// =============================================================
// PERSIST CONFIGS (Session Storage)
// =============================================================

const authPersistConfig = {
  key: "_",
  storage: storageSession,       // ✅ FIXED
  whitelist: ["LogResponce","Common"],
  transforms: [encryptDecryptTransform],
};


const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

// =============================================================
// ROOT REDUCER
// =============================================================

const rootReducer = combineReducers({
  GlobalStore: GlobalReducer,
  Auth: persistedAuthReducer,
  FormBuilderStore: FormBuilder_Reducer,
});

// =============================================================
// STORE CONFIG
// =============================================================

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env?.VITE_DEVELOPMENT_MODE !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// =============================================================
// PERSISTOR
// =============================================================

export const persistor = persistStore(store);
