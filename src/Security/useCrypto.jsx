// =======================================================
// src/Security/useCrypto.js
// =======================================================
// ✅ Class-based CryptoService
// ✅ Encrypt + Decrypt
// ✅ Legacy backend compatible (+ → *, / → -)
// ✅ Importable as: import CryptoService from "../Security/useCrypto";
// =======================================================

import CryptoJS from "crypto-js";
import { store } from "../Store/Store";

class CryptoService {
  /* =======================================================
     SESSION ACCESS
  ======================================================= */
  getSession() {
    const state = store.getState();
    return state?.Auth?.LogResponce?.data || null;
  }

  /* =======================================================
     KEY & IV
  ======================================================= */
  getKeyAndVector() {
    const session = this.getSession();

    if (!session?.Key || !session?.Vector) {
      console.error("❌ Crypto key/vector missing");
      return null;
    }

    return {
      key: CryptoJS.enc.Utf8.parse(session.Key),
      iv: CryptoJS.enc.Utf8.parse(session.Vector)
    };
  }

  /* =======================================================
     🔐 ENCRYPT (LEGACY FORMAT)
  ======================================================= */
  encrypt(data) {
    try {
      const crypto = this.getKeyAndVector();
      if (!crypto) return "";

      const { key, iv } = crypto;

      const plainText =
        typeof data === "string" ? data : JSON.stringify(data);

      const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // 🔥 backend-required mutation
      return encrypted
        .toString()
        .replace(/\+/g, "*")
        .replace(/\//g, "-");

    } catch (err) {
      console.error("encrypt failed:", err);
      return "";
    }
  }

  /* =======================================================
     🔐 ENCRYPTWITHAES (ALIAS FOR BACKWARD COMPATIBILITY)
  ======================================================= */
  EncryptWithAES(data) {
    return this.encrypt(data);
  }
  DecryptWithAES(encryptedText) {
    return this.decrypt(encryptedText);
  }

  /* =======================================================
     🔓 DECRYPT (LEGACY FORMAT)
  ======================================================= */
  decrypt(encryptedText) {
    try {
      if (!encryptedText) return null;

      const crypto = this.getKeyAndVector();
      if (!crypto) return null;

      const { key, iv } = crypto;

      // reverse legacy mutation
      const normalized = encryptedText
        .replace(/\*/g, "+")
        .replace(/-/g, "/");

      const decrypted = CryptoJS.AES.decrypt(normalized, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      if (!result) return null;

      try {
        return JSON.parse(result);
      } catch {
        return result;
      }

    } catch (err) {
      console.error("decrypt failed:", err);
      return null;
    }
  }

  /* =======================================================
     🔐 RAW BASE64 (OPTIONAL)
  ======================================================= */
  encryptRaw(data) {
    try {
      const crypto = this.getKeyAndVector();
      if (!crypto) return "";

      const { key, iv } = crypto;

      const text =
        typeof data === "string" ? data : JSON.stringify(data);

      return CryptoJS.AES.encrypt(text, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

    } catch {
      return "";
    }
  }

  /* =======================================================
     🔓 RAW BASE64 (OPTIONAL)
  ======================================================= */
  decryptRaw(encryptedText) {
    try {
      if (!encryptedText) return null;

      const crypto = this.getKeyAndVector();
      if (!crypto) return null;

      const { key, iv } = crypto;

      const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(result);
      } catch {
        return result;
      }

    } catch {
      return null;
    }
  }
}

export default new CryptoService();



// =======================================================
// ✅ USAGE
// =======================================================
//
// import CryptoService from "../Security/useCrypto";
//
// const encrypted = CryptoService.encrypt(form);
// const payload = `"${encrypted}"`;   // for raw-string APIs
//
// const decrypted = CryptoService.decrypt(encrypted);
//
// =======================================================
