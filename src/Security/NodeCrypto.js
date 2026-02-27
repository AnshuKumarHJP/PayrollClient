/**
 * NodeCrypto.js
 *
 * Encryption/decryption utilities for the Node.js HFactor API.
 */

import { store } from "../Store/Store";
import { encrypt, decrypt } from "./cryptoUtil";

// ── Static keys from Vite env ──────────────────────────────────────────────
const STATIC_KEY = import.meta.env.VITE_HFK;
const STATIC_IV = import.meta.env.VITE_HFV;

if (!STATIC_KEY || !STATIC_IV) {
    console.error("❌ NodeCrypto: VITE_HFK or VITE_HFV is missing in .env");
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the appropriate keys based on context.
 * @param {boolean} useStatic 
 */
function getKeys(useStatic) {
    if (useStatic) {
        return { key: STATIC_KEY, iv: STATIC_IV };
    }

    const state = store.getState();
    const cSharpKey = state?.Auth?.LogResponce?.data?.Key;
    const cSharpVector = state?.Auth?.LogResponce?.data?.Vector;

    if (!cSharpKey || !cSharpVector) {
        console.warn("NodeCrypto: session keys (Key/Vector) not found in Auth.LogResponce.data");
        return null;
    }

    return { key: cSharpKey, iv: cSharpVector };
}

// ─── Unified Encryption / Decryption ────────────────────────────────────────

export function encryptData(data, useStatic = false) {
    const keys = getKeys(useStatic);
    if (!keys) {
        console.error("NodeCrypto.encryptData failed: keys unavailable");
        return "";
    }
    return encrypt(data, keys.key, keys.iv) || "";
}

export function decryptData(ciphertext, useStatic = false) {
    if (!ciphertext) return null;
    const keys = getKeys(useStatic);
    if (!keys) {
        console.error("NodeCrypto.decryptData failed: keys unavailable");
        return null;
    }
    return decrypt(ciphertext, keys.key, keys.iv);
}
