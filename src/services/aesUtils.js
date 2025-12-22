import CryptoJS from "crypto-js";

/* ================== CONSTANTS ================== */

const HFK = import.meta.env.VITE_HFK; 
const HFV = import.meta.env.VITE_HFV; 

const LogFactor = ["Uid", "Xos", "Zck"];
const KeyVectorFactor = [
  "AuthCode",
  "Channel",
  "EventCode",
  "Format",
  "LogKey",
  "TenantId",
  "Token"
];

/* ================== MAIN FUNCTION ================== */
export function decryptResponseByAES(strToDecrypt) {
  const reForPlus = /\*/g;
  const reForSlash = /\-/g;

  const charReplacedStringToDecrypt = strToDecrypt
    .replace(reForPlus, "+")
    .replace(reForSlash, "/");

  const key = CryptoJS.enc.Utf8.parse(HFK);
  const vector = CryptoJS.enc.Utf8.parse(HFV);

  let decrypted;

  try {
    decrypted = CryptoJS.AES.decrypt(charReplacedStringToDecrypt, key, {
      keySize: 128 / 8,
      iv: vector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  } catch (ex) {
    console.error(ex);
    return null;
  }

  const parsed = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  return encryptDecryptHelper(parsed);
}

/* ================== HELPER ================== */
function encryptDecryptHelper(verificationLog) {
  if (!verificationLog) return null;

  const decodedRanIdString = atob(
    verificationLog.VisitorRandId.toString()
  );

  const keyVectorElementName = LogFactor[decodedRanIdString];

  const decodedLogFactorString = atob(
    verificationLog[keyVectorElementName].toString()
  );

  const digits = decodedLogFactorString.split("").map(Number);

  const keyElementName = KeyVectorFactor[digits[0]];
  const vectorElementName = KeyVectorFactor[digits[1]];

  const keyElementValue = verificationLog[keyElementName];
  const vectorElementValue = verificationLog[vectorElementName];

  const decryptedText = decryptHelper(
    keyElementValue,
    vectorElementValue,
    verificationLog.MfiLog
  );
  return decryptedText;
}

/* ================== FINAL DECRYPT ================== */
function decryptHelper(key, vector, stringValue) {
  const myStr = stringValue.replace(/"/g, "");

  const reForPlus = /\*/g;
  const reForSlash = /\-/g;

  const charReplacedStringToDecrypt = myStr
    .replace(reForPlus, "+")
    .replace(reForSlash, "/");

  const parsedKey = CryptoJS.enc.Latin1.parse(key);
  const parsedIV = CryptoJS.enc.Latin1.parse(vector);

  let decrypted;

  try {
    decrypted = CryptoJS.AES.decrypt(
      charReplacedStringToDecrypt,
      parsedKey,
      {
        keySize: 128 / 8,
        iv: parsedIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    ).toString(CryptoJS.enc.Utf8);
  } catch (ex) {
    console.error(ex);
    return null;
  }

  return JSON.parse(decrypted);
}
