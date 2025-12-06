import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserProfileStore } from '../profile.store'
import { http } from '@/lib/http'
import { getAuthToken, handleAuthError } from '@/lib/auth'
import { toast } from 'vue-sonner'
import type { UserProfile, UserProfileRequest } from '@/interfaces/profile.interface'

vi.mock('@/lib/http')
vi.mock('@/lib/auth')
vi.mock('vue-sonner')
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('useUserProfileStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.mocked(getAuthToken).mockReturnValue('fake-token')
  })

  describe('fetchProfiles', () => {
    it('should fetch profiles successfully', async () => {
      const mockProfiles: UserProfile[] = [
        {
          id: '1',
          username: 'user1',
          name: 'User One',
          email: 'user1@example.com',
          role: 'User',
          createdAt: '2024-01-01',
          isActive: true
        }
      ]

      vi.mocked(http.get).mockResolvedValue({
        data: { data: mockProfiles },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      const result = await store.fetchProfiles()

      expect(result).toEqual(mockProfiles)
      expect(store.profiles).toHaveLength(1)
      expect(store.loading).toBe(false)
      expect(toast.success).toHaveBeenCalledWith('Data profil berhasil dimuat')
    })

    it('should show warning when no profiles found', async () => {
      vi.mocked(http.get).mockResolvedValue({
        data: { data: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      await store.fetchProfiles()

      expect(store.profiles).toHaveLength(0)
      expect(toast.warning).toHaveBeenCalledWith('Data profil kosong')
    })

    it('should handle fetch error', async () => {
      vi.mocked(http.get).mockRejectedValue(new Error('Network error'))

      const store = useUserProfileStore()
      await store.fetchProfiles()

      expect(store.error).toBe('Network error')
      expect(toast.error).toHaveBeenCalledWith('Error saat memuat profil: Network error')
    })

    it('should handle auth error with axios error', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401 }
      }
      vi.mocked(http.get).mockRejectedValue(axiosError)

      const store = useUserProfileStore()
      await store.fetchProfiles()

      expect(handleAuthError).toHaveBeenCalledWith(401, expect.any(Object))
    })
  })

  describe('getProfileById', () => {
    it('should get profile by id successfully', async () => {
      const mockProfile: UserProfile = {
        id: '1',
        username: 'user1',
        name: 'User One',
        email: 'user1@example.com',
        role: 'User',
        createdAt: '2024-01-01',
        isActive: true
      }

      vi.mocked(http.get).mockResolvedValue({
        data: { data: mockProfile },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      const result = await store.getProfileById('1')

      expect(result).toEqual(mockProfile)
      expect(store.loading).toBe(false)
    })

    it('should handle get profile error', async () => {
      vi.mocked(http.get).mockRejectedValue(new Error('Not found'))

      const store = useUserProfileStore()
      const result = await store.getProfileById('999')

      expect(result).toBeNull()
      expect(store.error).toBe('Not found')
      expect(toast.error).toHaveBeenCalledWith('Error saat memuat profil: Not found')
    })
  })

  describe('createProfile', () => {
    it('should create profile successfully', async () => {
      const profileData: UserProfileRequest = {
        username: 'newuser',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'User'
      }

      const mockProfile: UserProfile = {
        id: 'new-1',
        ...profileData,
        createdAt: '2024-01-01',
        isActive: true
      }

      vi.mocked(http.post).mockResolvedValue({
        data: { data: mockProfile },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      const result = await store.createProfile(profileData)

      expect(result).toEqual(mockProfile)
      expect(store.profiles).toHaveLength(1)
      expect(toast.success).toHaveBeenCalledWith('Profil berhasil dibuat')
    })

    it('should handle 400 error when creating profile', async () => {
      const profileData: UserProfileRequest = {
        username: 'newuser',
        name: 'New User',
        email: 'invalid-email',
        password: 'password123',
        role: 'User'
      }

      vi.mocked(http.post).mockResolvedValue({
        data: { data: null },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      await store.createProfile(profileData)

      expect(toast.warning).toHaveBeenCalledWith('Gagal membuat profil: Data tidak valid atau ada kesalahan pada permintaan.')
    })

    it('should handle create profile error', async () => {
      const profileData: UserProfileRequest = {
        username: 'newuser',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'User'
      }

      vi.mocked(http.post).mockRejectedValue(new Error('Server error'))

      const store = useUserProfileStore()
      await store.createProfile(profileData)

      expect(store.error).toBe('Server error')
      expect(toast.error).toHaveBeenCalledWith('Error saat membuat profil: Server error')
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const profileData: UserProfileRequest = {
        id: '1',
        username: 'user1',
        name: 'Updated User',
        email: 'user1@example.com',
        role: 'User'
      }

      const mockProfile: UserProfile = {
        ...profileData,
        id: '1',
        createdAt: '2024-01-01',
        isActive: true
      }

      vi.mocked(http.put).mockResolvedValue({
        data: { data: mockProfile },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      const result = await store.updateProfile(profileData)

      expect(result).toEqual(mockProfile)
      expect(toast.success).toHaveBeenCalledWith('Profil berhasil diperbarui')
    })

    it('should handle 400 error when updating profile', async () => {
      const profileData: UserProfileRequest = {
        id: '1',
        username: 'user1',
        name: 'Updated User',
        email: 'invalid',
        role: 'User'
      }

      vi.mocked(http.put).mockResolvedValue({
        data: { data: null },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      await store.updateProfile(profileData)

      expect(toast.warning).toHaveBeenCalledWith('Gagal memperbarui profil: Data tidak valid atau ada kesalahan pada permintaan.')
    })

    it('should handle 404 error when updating profile', async () => {
      const profileData: UserProfileRequest = {
        id: '999',
        username: 'user999',
        name: 'Non-existent User',
        email: 'user999@example.com',
        role: 'User'
      }

      vi.mocked(http.put).mockResolvedValue({
        data: { data: null },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      await store.updateProfile(profileData)

      expect(toast.warning).toHaveBeenCalledWith('Profil tidak ditemukan: Data profil yang akan diperbarui tidak ditemukan.')
    })

    it('should handle update profile error', async () => {
      const profileData: UserProfileRequest = {
        id: '1',
        username: 'user1',
        name: 'Updated User',
        email: 'user1@example.com',
        role: 'User'
      }

      vi.mocked(http.put).mockRejectedValue(new Error('Update failed'))

      const store = useUserProfileStore()
      await store.updateProfile(profileData)

      expect(store.error).toBe('Update failed')
      expect(toast.error).toHaveBeenCalledWith('Error saat memperbarui profil: Update failed')
    })
  })

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      vi.mocked(http.delete).mockResolvedValue({
        data: { data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      vi.mocked(http.get).mockResolvedValue({
        data: { data: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      await store.deleteProfile('1')

      expect(toast.success).toHaveBeenCalledWith('Profil berhasil dihapus: Data profil telah berhasil dihapus.')
    })

    it('should handle 404 error when deleting profile', async () => {
      vi.mocked(http.delete).mockResolvedValue({
        data: { data: null },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any
      })

      const store = useUserProfileStore()
      await store.deleteProfile('999')

      expect(toast.warning).toHaveBeenCalledWith('Profil tidak ditemukan: Data profil yang akan dihapus tidak ditemukan.')
    })

    it('should handle delete profile error', async () => {
      vi.mocked(http.delete).mockRejectedValue(new Error('Delete failed'))

      const store = useUserProfileStore()
      await store.deleteProfile('1')

      expect(store.error).toBe('Delete failed')
      expect(toast.error).toHaveBeenCalledWith('Error saat menghapus profil: Delete failed')
    })
  })
})
