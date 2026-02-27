// =======================================================
// src/Security/useSecureSession.js
// =======================================================
// ✅ Store JSON → serialize → encrypt → sessionStorage
// ✅ Read sessionStorage → decrypt → parse → return
// ✅ Uses your existing CryptoService
// =======================================================

import CryptoService from "./useCryptocopy";

/* =======================================================
   CONSTANTS
======================================================= */
const PREFIX = "__SECURE__";

/* =======================================================
   SAVE TO SESSION (JSON → STRING → ENCRYPT)
======================================================= */
export const setSecureSession = (key, data) => {
  try {
    if (!key) return false;

    const jsonString = JSON.stringify(data);

    // 🔍 Check size before encryption (Encryption increases size by ~33%)
    const rawSizeMB = (jsonString.length / (1024 * 1024)).toFixed(2);
    if (rawSizeMB > 3.5) {
      console.warn(`⚠️ Large data detected for session key "${key}": ${rawSizeMB}MB. This might fail encryption or exceed browser limits.`);
    }

    const encrypted = CryptoService.encrypt(jsonString);
    if (!encrypted) return false;

    // 🔍 Check final size against Browser's 5MB sessionStorage limit
    const finalSizeMB = (encrypted.length / (1024 * 1024)).toFixed(2);
    if (finalSizeMB > 4.8) {
      console.error(`❌ CRITICAL: Session data for "${key}" is ${finalSizeMB}MB. Browser limit is 5MB. Storage will fail.`);
      // We might want to store it unencrypted or throw specific error, 
      // but for now we'll try and catch the QuotaExceededError below.
    }

    sessionStorage.setItem(`${PREFIX}${key}`, encrypted);
    return true;
  } catch (err) {
    if (err.name === 'QuotaExceededError') {
      console.error("❌ Session Storage Full: Could not save data. Limit exceeded (5MB).");
    } else {
      console.error("setSecureSession failed:", err);
    }
    return false;
  }
};

/* =======================================================
   GET FROM SESSION (DECRYPT → PARSE → JSON)
======================================================= */
export const getSecureSession = (key) => {
  try {
    if (!key) return null;

    const encrypted = sessionStorage.getItem(`${PREFIX}${key}`);
    if (!encrypted) return null;

    const decrypted = CryptoService.decrypt(encrypted);
    if (!decrypted) return null;

    // decrypted may already be object
    if (typeof decrypted === "object") return decrypted;

    return JSON.parse(decrypted);
  } catch (err) {
    console.error("getSecureSession failed:", err);
    return null;
  }
};

/* =======================================================
   REMOVE KEY
======================================================= */
export const removeSecureSession = (key) => {
  if (!key) return;
  sessionStorage.removeItem(`${PREFIX}${key}`);
};

/* =======================================================
   CLEAR ALL SECURE KEYS
======================================================= */
export const clearSecureSession = () => {
  Object.keys(sessionStorage).forEach((k) => {
    if (k.startsWith(PREFIX)) {
      sessionStorage.removeItem(k);
    }
  });
};




export const useSecureSession = () => {
  const setItem = useCallback((key, value) => {
    return setSecureSession(key, value);
  }, []);

  const getItem = useCallback((key) => {
    return getSecureSession(key);
  }, []);

  const removeItem = useCallback((key) => {
    removeSecureSession(key);
  }, []);

  return {
    setItem,
    getItem,
    removeItem,
  };
};