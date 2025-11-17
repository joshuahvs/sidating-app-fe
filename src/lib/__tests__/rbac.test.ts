import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  UserRole,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  canAccessProfile,
  canAccessProfileList,
  canCreateProfile
} from '../rbac'
import type { CurrentUser } from '@/interfaces/profile.interface'

// Mock the auth module
vi.mock('../auth', () => ({
  getLocalStorage: vi.fn(),
  getAuthToken: vi.fn()
}))

import { getLocalStorage, getAuthToken } from '../auth'

describe('rbac.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('UserRole enum', () => {
    it('should have ADMIN role', () => {
      expect(UserRole.ADMIN).toBe('ADMIN')
    })

    it('should have USER role', () => {
      expect(UserRole.USER).toBe('USER')
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user from localStorage', () => {
      const mockUser: CurrentUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'USER'
      }
      
      vi.mocked(getLocalStorage).mockReturnValue(mockUser)
      
      const result = getCurrentUser()
      
      expect(result).toEqual(mockUser)
      expect(getLocalStorage).toHaveBeenCalledWith('user')
    })

    it('should return null when no user exists', () => {
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = getCurrentUser()
      
      expect(result).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when both token and user exist', () => {
      vi.mocked(getAuthToken).mockReturnValue('valid-token')
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'USER'
      })
      
      const result = isAuthenticated()
      
      expect(result).toBe(true)
    })

    it('should return false when token is missing', () => {
      vi.mocked(getAuthToken).mockReturnValue(null)
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'USER'
      })
      
      const result = isAuthenticated()
      
      expect(result).toBe(false)
    })

    it('should return false when user is missing', () => {
      vi.mocked(getAuthToken).mockReturnValue('valid-token')
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = isAuthenticated()
      
      expect(result).toBe(false)
    })

    it('should return false when both token and user are missing', () => {
      vi.mocked(getAuthToken).mockReturnValue(null)
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = isAuthenticated()
      
      expect(result).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'admin',
        email: 'admin@example.com',
        roleName: 'ADMIN'
      })
      
      const result = isAdmin()
      
      expect(result).toBe(true)
    })

    it('should return true for admin user with lowercase role', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'admin',
        email: 'admin@example.com',
        roleName: 'admin'
      })
      
      const result = isAdmin()
      
      expect(result).toBe(true)
    })

    it('should return false for regular user', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'user',
        email: 'user@example.com',
        roleName: 'USER'
      })
      
      const result = isAdmin()
      
      expect(result).toBe(false)
    })

    it('should return false when user has no role', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'user',
        email: 'user@example.com'
      } as any)
      
      const result = isAdmin()
      
      expect(result).toBe(false)
    })

    it('should return false when role is not a string', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: '123',
        username: 'user',
        email: 'user@example.com',
        roleName: 123 as any
      })
      
      const result = isAdmin()
      
      expect(result).toBe(false)
    })

    it('should return false when no user exists', () => {
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = isAdmin()
      
      expect(result).toBe(false)
    })
  })

  describe('canAccessProfile', () => {
    it('should return true for admin accessing any profile', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'admin-123',
        username: 'admin',
        email: 'admin@example.com',
        roleName: 'ADMIN'
      })
      
      const result = canAccessProfile('user-456')
      
      expect(result).toBe(true)
    })

    it('should return true for user accessing their own profile', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'user-123',
        username: 'user',
        email: 'user@example.com',
        roleName: 'USER'
      })
      
      const result = canAccessProfile('user-123')
      
      expect(result).toBe(true)
    })

    it('should return false for user accessing another profile', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'user-123',
        username: 'user',
        email: 'user@example.com',
        roleName: 'USER'
      })
      
      const result = canAccessProfile('user-456')
      
      expect(result).toBe(false)
    })

    it('should return false when no user exists', () => {
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = canAccessProfile('user-123')
      
      expect(result).toBe(false)
    })
  })

  describe('canAccessProfileList', () => {
    it('should return true for admin user', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'admin-123',
        username: 'admin',
        email: 'admin@example.com',
        roleName: 'ADMIN'
      })
      
      const result = canAccessProfileList()
      
      expect(result).toBe(true)
    })

    it('should return false for regular user', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'user-123',
        username: 'user',
        email: 'user@example.com',
        roleName: 'USER'
      })
      
      const result = canAccessProfileList()
      
      expect(result).toBe(false)
    })

    it('should return false when no user exists', () => {
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = canAccessProfileList()
      
      expect(result).toBe(false)
    })
  })

  describe('canCreateProfile', () => {
    it('should return true for admin user', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'admin-123',
        username: 'admin',
        email: 'admin@example.com',
        roleName: 'ADMIN'
      })
      
      const result = canCreateProfile()
      
      expect(result).toBe(true)
    })

    it('should return false for regular user', () => {
      vi.mocked(getLocalStorage).mockReturnValue({
        id: 'user-123',
        username: 'user',
        email: 'user@example.com',
        roleName: 'USER'
      })
      
      const result = canCreateProfile()
      
      expect(result).toBe(false)
    })

    it('should return false when no user exists', () => {
      vi.mocked(getLocalStorage).mockReturnValue(null)
      
      const result = canCreateProfile()
      
      expect(result).toBe(false)
    })
  })
})
