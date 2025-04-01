import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

/**
 * Generates a random UUID (v4)
 * @returns A random UUID string
 */
export const generateUniqueKey = () => {
  return uuidv4();
};

/**
 * Generates a time-based UUID (v1)
 * @returns A time-based UUID string
 */
export const generateTimeBasedKey = () => {
  return uuidv1();
};

/**
 * Generates a simple unique key with a custom prefix
 * @param prefix Optional prefix for the key
 * @returns A string with the format: prefix-uuid
 */
export const generatePrefixedKey = (prefix = 'key') => {
  return `${prefix}-${uuidv4()}`;
}; 