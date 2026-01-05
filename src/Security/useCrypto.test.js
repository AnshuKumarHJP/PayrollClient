import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import useCrypto from './useCrypto';

// Mock Redux store with Auth state
const createMockStore = (authState = {}) => {
  return configureStore({
    reducer: {
      Auth: (state = authState) => state
    }
  });
};

describe('useCrypto Hook', () => {
  const mockKey = '1234567890123456'; // 16 bytes for AES-128
  const mockVector = '1234567890123456'; // 16 bytes for AES-128

  const mockStore = createMockStore({
    LogResponse: {
      data: {
        Key: mockKey,
        Vector: mockVector
      }
    }
  });

  const wrapper = ({ children }) => (
    <Provider store={mockStore}>{children}</Provider>
  );

  test('should return all crypto methods', () => {
    const { result } = renderHook(() => useCrypto(), { wrapper });

    expect(result.current).toHaveProperty('encrypt');
    expect(result.current).toHaveProperty('decrypt');
    expect(result.current).toHaveProperty('encryptSimple');
    expect(result.current).toHaveProperty('decryptSimple');
    expect(result.current).toHaveProperty('encryptWithAES');
    expect(result.current).toHaveProperty('decryptWithAES');
  });

  test('encryptSimple and decryptSimple should work together', () => {
    const { result } = renderHook(() => useCrypto(), { wrapper });

    const testData = { message: 'Hello World', id: 123 };
    const testKey = 'testKey123';

    const encrypted = result.current.encryptSimple(testData, testKey);
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe('string');

    const decrypted = result.current.decryptSimple(encrypted, testKey);
    expect(decrypted).toEqual(testData);
  });

  test('encryptWithAES and decryptWithAES should work together', () => {
    const { result } = renderHook(() => useCrypto(), { wrapper });

    const testString = 'Test encryption string';

    const encrypted = result.current.encryptWithAES(testString);
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe('string');
    // Should contain replaced characters
    expect(encrypted).not.toContain('+');
    expect(encrypted).not.toContain('/');

    const decrypted = result.current.decryptWithAES(encrypted);
    expect(decrypted).toBe(testString);
  });

  test('encrypt and decrypt should work together with integrity check', () => {
    const { result } = renderHook(() => useCrypto(), { wrapper });

    const testData = 'Test data for secure encryption';

    const encrypted = result.current.encrypt(testData);
    expect(encrypted).toBeTruthy();

    const decrypted = result.current.decrypt(encrypted);
    expect(decrypted).toBe(testData);
  });

  test('should handle missing session data gracefully', () => {
    const emptyStore = createMockStore({});
    const emptyWrapper = ({ children }) => (
      <Provider store={emptyStore}>{children}</Provider>
    );

    const { result } = renderHook(() => useCrypto(), { wrapper: emptyWrapper });

    // Methods that depend on session should return empty/null
    expect(result.current.encrypt('test')).toBe('');
    expect(result.current.decrypt('test')).toBeNull();
    expect(result.current.encryptWithAES('test')).toBe('');
    expect(result.current.decryptWithAES('test')).toBeNull();

    // Simple methods should still work with provided keys
    const encrypted = result.current.encryptSimple('test', 'key');
    expect(encrypted).toBeTruthy();
  });

  test('should handle invalid inputs', () => {
    const { result } = renderHook(() => useCrypto(), { wrapper });

    expect(result.current.encryptSimple(null, 'key')).toBe('');
    expect(result.current.encryptSimple('data', null)).toBe('');
    expect(result.current.decryptSimple(null, 'key')).toBeNull();
    expect(result.current.decryptSimple('data', null)).toBeNull();
  });
});
