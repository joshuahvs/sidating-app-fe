import type { CurrentUser } from '@/interfaces/profile.interface';
import { getLocalStorage, getAuthToken } from './auth';
 
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
 
/**
 * Retrieves the current user from localStorage.
 * @returns The current user object or null if not found.
 */
export function getCurrentUser(): CurrentUser | null {
  return getLocalStorage<CurrentUser>('user');
}
 
/**
 * Checks if the user is authenticated.
 * @returns True if authenticated, false otherwise.
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
}
 
/**
 * Checks if the current user has admin role.
 * @returns True if the user is an admin, false otherwise.
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  const role = user?.roleName;
  if (!role || typeof role !== 'string') return false;
  return String(role).toUpperCase() === UserRole.ADMIN;
}
 
/** Checks if the current user can access a specific profile.
 * @param profileId - The ID of the profile to check access for.
 * @returns True if the user can access the profile, false otherwise.
 */
export function canAccessProfile(profileId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
 
  if (isAdmin()) return true; // Admin can access any profile
 
  // Regular users can only access their own profile
  return user.id === profileId;
}
 
/** Checks if the current user can access the profile list.
 * @returns True if the user can access the profile list, false otherwise.
 */
export function canAccessProfileList(): boolean {
  return isAdmin();
}
 
/** Checks if the current user can create a new profile.
 * @returns True if the user can create a profile, false otherwise.
 */
export function canCreateProfile(): boolean {
  return isAdmin();
}

/**
 * Checks if the current user can edit/delete a reply.
 * @param replyUserProfileId - The ID of the user who created the reply.
 * @returns True if the user can edit/delete the reply, false otherwise.
 */
export function canModifyReply(replyUserProfileId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (isAdmin()) return true; // Admin can modify any reply

  // Regular users can only modify their own replies
  return user.id === replyUserProfileId;
}