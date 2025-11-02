import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth.store'
import axios from 'axios'
import type { LoginRequest } from '@/interfaces/auth.interface'
import type { CommonResponseInterface } from '@/interfaces/common.interface'
import type { CurrentUser } from '@/interfaces/profile.interface'

vi.mock('axios')
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('@/lib/auth', () => ({
  setLocalStorage: vi.fn(),
  clearLocalStorage: vi.fn()
}))

import { toast } from 'vue-sonner'
import { setLocalStorage, clearLocalStorage } from '@/lib/auth'

describe('auth.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useAuthStore()
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('login action', () => {
    it('should successfully login user', async () => {
      const store = useAuthStore()
      const loginPayload: LoginRequest = {
        username: 'testuser',
        password: 'password123'
      }
      
      const mockResponse: CommonResponseInterface<{ token: string } & CurrentUser> = {
        status: 'success',
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token',
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roleName: 'USER'
        }
      }

      vi.mocked(axios.post).mockResolvedValue({ data: mockResponse })

      await store.login(loginPayload)

      expect(store.loading).toBe(false)
      expect(store.token).toBe('mock-jwt-token')
      expect(store.user).toEqual({
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'USER'
      })
      expect(store.error).toBeNull()
      expect(setLocalStorage).toHaveBeenCalledWith('token', 'mock-jwt-token')
      expect(setLocalStorage).toHaveBeenCalledWith('user', {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'USER'
      })
      expect(toast.success).toHaveBeenCalledWith('Login successful')
    })

    it('should set loading to true during login', async () => {
      const store = useAuthStore()
      const loginPayload: LoginRequest = {
        username: 'testuser',
        password: 'password123'
      }
      
      const mockResponse: CommonResponseInterface<{ token: string } & CurrentUser> = {
        status: 'success',
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token',
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roleName: 'USER'
        }
      }

      vi.mocked(axios.post).mockImplementation(() => {
        expect(store.loading).toBe(true)
        return Promise.resolve({ data: mockResponse })
      })

      await store.login(loginPayload)
      
      expect(store.loading).toBe(false)
    })

    it('should handle login error with Error instance', async () => {
      const store = useAuthStore()
      const loginPayload: LoginRequest = {
        username: 'testuser',
        password: 'wrongpassword'
      }

      const error = new Error('Invalid credentials')
      vi.mocked(axios.post).mockRejectedValue(error)

      await store.login(loginPayload)

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Invalid credentials')
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(toast.error).toHaveBeenCalledWith('Error saat memuat post: Invalid credentials')
    })

    it('should handle login error with unknown error', async () => {
      const store = useAuthStore()
      const loginPayload: LoginRequest = {
        username: 'testuser',
        password: 'wrongpassword'
      }

      vi.mocked(axios.post).mockRejectedValue('Unknown error')

      await store.login(loginPayload)

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Unknown error')
      expect(toast.error).toHaveBeenCalledWith('Error saat memuat post: Unknown error')
    })

    it('should use custom message from response', async () => {
      const store = useAuthStore()
      const loginPayload: LoginRequest = {
        username: 'testuser',
        password: 'password123'
      }
      
      const mockResponse: CommonResponseInterface<{ token: string } & CurrentUser> = {
        status: 'success',
        message: 'Welcome back!',
        data: {
          token: 'mock-jwt-token',
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          roleName: 'USER'
        }
      }

      vi.mocked(axios.post).mockResolvedValue({ data: mockResponse })

      await store.login(loginPayload)

      expect(toast.success).toHaveBeenCalledWith('Welcome back!')
    })
  })

  describe('logout action', () => {
    it('should successfully logout user', async () => {
      const store = useAuthStore()
      
      // Set initial state
      store.user = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'USER'
      }
      store.token = 'mock-jwt-token'

      await store.logout()

      expect(store.loading).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.error).toBeNull()
      expect(clearLocalStorage).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Logout successful')
    })

    it('should set loading to true during logout', async () => {
      const store = useAuthStore()

      vi.mocked(clearLocalStorage).mockImplementation(() => {
        expect(store.loading).toBe(true)
      })

      await store.logout()
      
      expect(store.loading).toBe(false)
    })

    it('should handle logout error with Error instance', async () => {
      const store = useAuthStore()
      const error = new Error('Logout failed')
      
      vi.mocked(clearLocalStorage).mockImplementation(() => {
        throw error
      })

      await store.logout()

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Logout failed')
      expect(toast.error).toHaveBeenCalledWith('Error saat logout: Logout failed')
    })

    it('should handle logout error with unknown error', async () => {
      const store = useAuthStore()
      
      vi.mocked(clearLocalStorage).mockImplementation(() => {
        throw 'Unknown logout error'
      })

      await store.logout()

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Unknown error')
      expect(toast.error).toHaveBeenCalledWith('Error saat logout: Unknown error')
    })
  })
})
