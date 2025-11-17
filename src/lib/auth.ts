import { toast } from 'vue-sonner';
import type { CurrentUser } from '@/interfaces/profile.interface';
 
/**
 * Sets a value in localStorage after serializing it to JSON.
 * @param key - The key under which the value will be stored.
 * @param value - The value to store, which will be serialized to JSON.
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to set localStorage item "${key}":`, error);
  }
}
 
/**
 * Retrieves and deserializes a JSON value from localStorage.
 * @param key - The key of the item to retrieve.
 * @returns The deserialized value, or null if not found or on error.
 */
export function getLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage item "${key}":`, error);
    return null;
  }
}
 
/**
 * Removes an item from localStorage.
 * @param key - The key of the item to remove.
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage item "${key}":`, error);
  }
}
 
/**
 * Clears all items from localStorage.
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
 
/**
 * Retrieves the authentication token from localStorage.
 * @returns The auth token string or null if not found.
 */
export function getAuthToken(): string | null {
  return getLocalStorage<string>('token');
}
 
/**
 * Retrieves the current user from localStorage.
 * @returns The current user object or null if not found.
 */
export function getCurrentUser(): CurrentUser | null {
  return getLocalStorage<CurrentUser>('user');
}
 
/** * Handles authentication-related HTTP errors.
 * @param statusCode - The HTTP status code from the response.
 * @param router - The Vue Router instance for navigation.
 */
export async function handleAuthError(statusCode: number, router: any): Promise<void> {
  if (statusCode === 401) {
    clearLocalStorage();
    const path = router?.currentRoute?.value?.path || '';
    // More accurate message: 401 often means missing/invalid token, not always expired
    toast.error('Unauthorized: invalid or missing token. Please log in.');
    if (path !== '/login') router.push('/login');
  } else if (statusCode === 403) {
    toast.error('Access forbidden');
    if (router?.currentRoute?.value?.path !== '/') router.push('/');
  }
}