import CryptoJS from "crypto-js";

const HFK = import.meta.env.VITE_HFK; 
const HFV = import.meta.env.VITE_HFV; 

export function decryptAES(encryptedString) {
  try {
    if (!encryptedString) return null;

    // restore replaced chars
    const normalized = encryptedString
      .replace(/\*/g, "+")
      .replace(/\-/g, "/");

    const key = CryptoJS.enc.Utf8.parse(HFK);
    const vector = CryptoJS.enc.Utf8.parse(HFV);

    const decryptedBytes = CryptoJS.AES.decrypt(normalized, key, {
      keySize: 128 / 8,
      iv: vector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const rawText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    console.log("🔥 LEVEL-1 DECRYPT RAW:", rawText);

    return JSON.parse(rawText);

  } catch (err) {
    console.error("❌ decryptAES ERROR:", err);
    return null;
  }
}

export default {
  decryptAES
};
