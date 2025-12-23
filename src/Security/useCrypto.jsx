// useCrypto.js
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";

const useCrypto = () => {
  const session = useSelector(
    (state) => state.Auth?.LogResponce?.data
  );
// console.log(session);

  const KEY = session?.Key;
  const VECTOR = session?.Vector;

  /* ============================================================
      SECURE ENCRYPT — adds integrity signature
  ============================================================ */
  const encrypt = (value) => {
    if (!KEY || !VECTOR) return "";

    try {
      const key = CryptoJS.enc.Utf8.parse(KEY);
      const iv = CryptoJS.enc.Utf8.parse(VECTOR);

      // Add integrity hash
      const payload = {
        data: value,
        sig: CryptoJS.SHA256(value + KEY).toString(),
      };

      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(payload),
        key,
        {
          keySize: 128 / 8,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      return encrypted.toString()
        .replace(/\+/g, "*")
        .replace(/\//g, "-");

    } catch (err) {
      console.error("Encrypt error", err);
      return "";
    }
  };


  /* ============================================================
      SECURE DECRYPT — rejects tampered URLs
  ============================================================ */
  const decrypt = (cipherText) => {
    if (!KEY || !VECTOR || !cipherText) return null;

    try {
      const normalized = cipherText
        .replace(/\*/g, "+")
        .replace(/\-/g, "/");

      const key = CryptoJS.enc.Utf8.parse(KEY);
      const iv = CryptoJS.enc.Utf8.parse(VECTOR);

      const decrypted = CryptoJS.AES.decrypt(
        normalized,
        key,
        {
          keySize: 128 / 8,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      const utf8 = decrypted.toString(CryptoJS.enc.Utf8);

      // ⛔ If decrypt fails
      if (!utf8 || utf8.trim() === "") return null;

      let parsed;
      try {
        parsed = JSON.parse(utf8);
      } catch {
        return null;
      }

      // Validate integrity signature
      const expectedSig = CryptoJS.SHA256(parsed.data + KEY).toString();
      if (parsed.sig !== expectedSig) {
        console.warn("Tampered data detected");
        return null;
      }

      return parsed.data;

    } catch (err) {
      console.error("Decrypt error", err);
      return null;
    }
  };

  return { encrypt, decrypt };
};

export default useCrypto;
