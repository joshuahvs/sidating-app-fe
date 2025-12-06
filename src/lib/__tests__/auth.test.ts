import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  getAuthToken,
  getCurrentUser,
  handleAuthError
} from '../auth'
import type { CurrentUser } from '@/interfaces/profile.interface'

describe('auth.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('setLocalStorage', () => {
    it('should store a string value in localStorage', () => {
      setLocalStorage('testKey', 'testValue')
      expect(localStorage.getItem('testKey')).toBe('"testValue"')
    })

    it('should store an object value in localStorage', () => {
      const obj = { name: 'John', age: 30 }
      setLocalStorage('user', obj)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(obj))
    })

    it('should store an array value in localStorage', () => {
      const arr = [1, 2, 3]
      setLocalStorage('numbers', arr)
      expect(localStorage.getItem('numbers')).toBe(JSON.stringify(arr))
    })

    it('should handle error when serialization fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const circular: any = {}
      circular.self = circular
      
      setLocalStorage('circular', circular)
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to set localStorage item'),
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })

  describe('getLocalStorage', () => {
    it('should retrieve and parse a string value', () => {
      localStorage.setItem('testKey', JSON.stringify('testValue'))
      const result = getLocalStorage<string>('testKey')
      expect(result).toBe('testValue')
    })

    it('should retrieve and parse an object value', () => {
      const obj = { name: 'John', age: 30 }
      localStorage.setItem('user', JSON.stringify(obj))
      const result = getLocalStorage<typeof obj>('user')
      expect(result).toEqual(obj)
    })

    it('should return null when key does not exist', () => {
      const result = getLocalStorage<string>('nonExistent')
      expect(result).toBeNull()
    })

    it('should return null when parsing fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorage.setItem('invalid', 'not valid json')
      const result = getLocalStorage<any>('invalid')
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse localStorage item'),
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })

  describe('removeLocalStorage', () => {
    it('should remove an item from localStorage', () => {
      localStorage.setItem('testKey', 'testValue')
      expect(localStorage.getItem('testKey')).toBeTruthy()
      
      removeLocalStorage('testKey')
      
      expect(localStorage.getItem('testKey')).toBeNull()
    })

    it('should not throw error when removing non-existent key', () => {
      expect(() => removeLocalStorage('nonExistent')).not.toThrow()
    })
  })

  describe('clearLocalStorage', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')
      localStorage.setItem('key3', 'value3')
      
      expect(localStorage.length).toBe(3)
      
      clearLocalStorage()
      
      expect(localStorage.length).toBe(0)
    })
  })

  describe('getAuthToken', () => {
    it('should retrieve token from localStorage', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      localStorage.setItem('token', JSON.stringify(token))
      
      const result = getAuthToken()
      
      expect(result).toBe(token)
    })

    it('should return null when token does not exist', () => {
      const result = getAuthToken()
      expect(result).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should retrieve current user from localStorage', () => {
      const user: CurrentUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER'
      }
      localStorage.setItem('user', JSON.stringify(user))
      
      const result = getCurrentUser()
      
      expect(result).toEqual(user)
    })

    it('should return null when user does not exist', () => {
      const result = getCurrentUser()
      expect(result).toBeNull()
    })
  })

  describe('handleAuthError', () => {
    it('should handle 401 error and redirect to login', async () => {
      const mockRouter = {
        push: vi.fn(),
        currentRoute: {
          value: {
            path: '/profiles'
          }
        }
      }
      
      localStorage.setItem('token', JSON.stringify('some-token'))
      localStorage.setItem('user', JSON.stringify({ id: '123' }))
      
      await handleAuthError(401, mockRouter)
      
      expect(localStorage.length).toBe(0)
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('should handle 401 error without redirecting when already on login page', async () => {
      const mockRouter = {
        push: vi.fn(),
        currentRoute: {
          value: {
            path: '/login'
          }
        }
      }
      
      await handleAuthError(401, mockRouter)
      
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should handle 403 error and redirect to home', async () => {
      const mockRouter = {
        push: vi.fn(),
        currentRoute: {
          value: {
            path: '/admin'
          }
        }
      }
      
      await handleAuthError(403, mockRouter)
      
      expect(mockRouter.push).toHaveBeenCalledWith('/')
    })

    it('should handle 403 error without redirecting when already on home page', async () => {
      const mockRouter = {
        push: vi.fn(),
        currentRoute: {
          value: {
            path: '/'
          }
        }
      }
      
      await handleAuthError(403, mockRouter)
      
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('should ignore other status codes', async () => {
      const mockRouter = {
        push: vi.fn(),
        currentRoute: {
          value: {
            path: '/profiles'
          }
        }
      }
      
      await handleAuthError(500, mockRouter)
      
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })
})
