// cryptoUtil.js
import CryptoJS from "crypto-js";

// Helper to safely parse strings that might be hex-encoded C# keys/vectors
function parseKeyString(raw, maxBytes) {
    if (!raw) throw new Error("Key/IV string is empty");

    const cleaned = raw.startsWith("0x") || raw.startsWith("0X") ? raw.slice(2) : raw;

    // If it looks like a hex string (even length, only hex chars) which session keys usually are
    const isHex = /^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length % 2 === 0 && cleaned.length >= 32;

    let parsed = (raw.startsWith("0x") || raw.startsWith("0X") || isHex)
        ? CryptoJS.enc.Hex.parse(cleaned)
        : CryptoJS.enc.Utf8.parse(raw);

    if (maxBytes && parsed.sigBytes > maxBytes) {
        // Truncate to required block size (like IV to 16 bytes)
        parsed = CryptoJS.lib.WordArray.create(parsed.words.slice(0, maxBytes / 4), maxBytes);
    }

    return parsed;
}

/**
 * Encrypt data using AES CBC with key and IV
 * @param {string|object} data
 * @param {string} key - 32 char key recommended
 * @param {string} iv - 16 char IV recommended
 * @returns {string} base64 encrypted string
 */
export function encrypt(data, key, iv) {
    try {
        const keyWA = parseKeyString(key);
        const ivWA = parseKeyString(iv, 16);

        const text = typeof data === "string" ? data : JSON.stringify(data);

        const encrypted = CryptoJS.AES.encrypt(
            text, // Pass plain string directly
            keyWA,
            {
                iv: ivWA,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        return encrypted.toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

/**
 * Decrypt AES encrypted string
 * @param {string} cipherText
 * @param {string} key
 * @param {string} iv
 * @returns {string|object|null}
 */
export function decrypt(cipherText, key, iv) {
    try {
        const keyWA = parseKeyString(key);
        const ivWA = parseKeyString(iv, 16);

        const decrypted = CryptoJS.AES.decrypt(cipherText, keyWA, {
            iv: ivWA,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const text = decrypted.toString(CryptoJS.enc.Utf8);

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }

    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}