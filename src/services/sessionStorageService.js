import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';

class SessionStorageService {
  constructor() {
    this.storageSub = new Subject();
    this.EncryptKey = '7061737323313233'; // Same key as in the Angular version
  }

  watchStorage() {
    return this.storageSub.asObservable();
  }

  setItem(key, data) {
    sessionStorage.setItem(key, data);
    this.storageSub.next(sessionStorage.getItem('isEmployee'));
  }

  removeItem(key) {
    sessionStorage.removeItem(key);
    this.storageSub.next(sessionStorage.getItem('isEmployee'));
  }

  setSessionStorage(key, value) {
    let ciphertext;

    if (this.toJson(value)) {
      ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), this.EncryptKey);
    } else {
      ciphertext = CryptoJS.AES.encrypt(value.toString(), this.EncryptKey);
    }
    sessionStorage.setItem(key, ciphertext.toString());
  }

  getSessionStorage(key) {
    let decryptedData = null;

    const value = sessionStorage.getItem(key);
    if (value != null) {
      const bytes = CryptoJS.AES.decrypt(value.toString(), this.EncryptKey);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      // Try to parse as JSON, if it fails, return as string
      try {
        decryptedData = JSON.parse(decryptedString);
      } catch (e) {
        decryptedData = decryptedString;
      }
    }
    return decryptedData;
  }

  delSessionStorage(key) {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }

  toJson(item) {
    item = typeof item !== 'string'
      ? JSON.stringify(item)
      : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === 'object' && item !== null) {
      return true;
    }

    return false;
  }
}

// Export a singleton instance
const sessionStorageService = new SessionStorageService();
export default sessionStorageService;
