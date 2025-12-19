import CryptoJS from "crypto-js";

const HFK = import.meta.env.VITE_HFK;
const HFV = import.meta.env.VITE_HFV;

// SAME MAPS AS ANGULAR — DO NOT CHANGE
const LogFactor = [
  "LogKey",
  "GfiLog",
  "MfiLog",
  "AuthCode",
  "EventCode",
  "Format",
  "TenantId",
  "Token",
  "channel",
  "Xos"
];

const KeyVectorFactor = [
  "AuthCode",
  "EventCode",
  "Format",
  "GfiLog",
  "MfiLog",
  "TenantId",
  "Token",
  "channel",
  "Xos",
  "Zck"
];

// ------------------------------------------------------
// LEVEL 1 — decrypt entire Result using HFK / HFV
// ------------------------------------------------------
function decryptLevel1(encrypted) {
  const normalized = encrypted.replace(/\*/g, "+").replace(/\-/g, "/");

  const key = CryptoJS.enc.Utf8.parse(HFK);
  const iv = CryptoJS.enc.Utf8.parse(HFV);

  const bytes = CryptoJS.AES.decrypt(normalized, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// ------------------------------------------------------
// LEVEL 2 — dynamic AES key + IV selector
// ------------------------------------------------------
function extractDynamicKeyVector(obj) {
  console.log("obj.VisitorRandId:", obj.VisitorRandId);
  if (!obj.VisitorRandId) {
    throw new Error("VisitorRandId is missing or undefined");
  }

  let index;
  try {
    // base64 decode: "MQ==" → "1" etc.
    index = parseInt(atob(obj.VisitorRandId), 10);
  } catch (e) {
    console.log("atob failed, trying as plain number");
    // Fallback: assume it's already a plain number
    index = parseInt(obj.VisitorRandId, 10);
    if (isNaN(index)) {
      console.log("parseInt also failed, index:", index);
      throw new Error("VisitorRandId is neither valid base64 nor a valid number");
    }
  }

  console.log("index:", index);
  const fieldName = LogFactor[index];
  console.log("fieldName:", fieldName);
  const encodedSelector = obj[fieldName];
  console.log("encodedSelector:", encodedSelector);

  const decoded = atob(encodedSelector); // ex: "45"
  console.log("decoded:", decoded);

  const [d1, d2] = decoded.split("").map(Number);
  console.log("d1, d2:", d1, d2);

  const key = obj[KeyVectorFactor[d1]];
  const iv = obj[KeyVectorFactor[d2]];
  console.log("key, iv:", key, iv);

  return { key, iv };
}

// ------------------------------------------------------
// LEVEL 3 — decrypt ONLY AES-encrypted fields
// ------------------------------------------------------
function decryptFieldAES(encrypted, key, iv) {
  if (!encrypted) return encrypted;

  const normalized = encrypted.replace(/\*/g, "+").replace(/\-/g, "/");

  const keyParsed = CryptoJS.enc.Latin1.parse(key);
  const ivParsed = CryptoJS.enc.Latin1.parse(iv);

  const bytes = CryptoJS.AES.decrypt(normalized, keyParsed, {
    keySize: 128 / 8,
    iv: ivParsed,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
}

// ------------------------------------------------------
// MASTER — full Angular behavior
// ------------------------------------------------------
function decryptAES(encrypted) {
  const lvl1 = decryptLevel1(encrypted);

  const { key, iv } = extractDynamicKeyVector(lvl1);

  const result = { ...lvl1 };

  // Only AES encrypted fields (very important)
  // Only AES encrypted fields (suspected)
const encryptedFields = ["GfiLog", "MfiLog", "Token"];

encryptedFields.forEach((field) => {
  const value = lvl1[field];

  if (!value) {
    console.warn(`⚠️ Field ${field} is empty or missing, skipping...`);
    return;
  }

  try {
    console.log(`🔍 Decrypting field: ${field}`);
    result[field] = decryptFieldAES(value, key, iv);
    console.log(`✅ Decrypted ${field}:`, result[field]);
  } catch (err) {
    console.error(`❌ FAILED to decrypt field ${field}:`, err);
    result[field] = null; // prevent crash
  }
});


  return result;
}

export default { decryptAES };
