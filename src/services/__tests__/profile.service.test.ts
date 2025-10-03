import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProfileService, profileService } from '../profile.service'
import type { UserProfileRequest } from '../../interfaces/profile.interface'

describe('ProfileService', () => {
  let service: ProfileService

  beforeEach(() => {
    service = ProfileService.getInstance()
    // Clear any existing profiles for clean tests
    const profiles = service.getAllProfiles()
    profiles.splice(0, profiles.length) // Clear the array completely
  })

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = ProfileService.getInstance()
      const instance2 = ProfileService.getInstance()
      expect(instance1).toBe(instance2)
    })

    it('should return the same instance as exported profileService', () => {
      expect(service).toBe(profileService)
    })
  })

  describe('createProfile', () => {
    it('should create a new profile with valid data', () => {
      const profileRequest: UserProfileRequest = {
        name: 'John Doe',
        nickname: 'johndoe',
        birthdate: '1990-01-01',
        hobbies: ['reading', 'gaming'],
        gender: 'Male',
        location: 'Jakarta, Indonesia',
        bio: 'A software developer',
        email: 'john@example.com',
        phoneNumber: '+628123456789',
        interests: ['technology', 'sports']
      }

      const result = service.createProfile(profileRequest)

      expect(result).not.toBeNull()
      expect(result?.name).toBe(profileRequest.name)
      expect(result?.nickname).toBe(profileRequest.nickname)
      expect(result?.email).toBe(profileRequest.email)
      expect(result?.id).toBe('test-uuid-123')
      expect(result?.birthdate).toBeInstanceOf(Date)
      expect(result?.createdAt).toBeInstanceOf(Date)
      expect(result?.updatedAt).toBeInstanceOf(Date)
      expect(result?.isActive).toBe(true)
    })

    it('should convert birthdate string to Date object', () => {
      const profileRequest: UserProfileRequest = {
        name: 'Jane Doe',
        nickname: 'janedoe',
        birthdate: '1995-06-15',
        hobbies: [],
        gender: 'Female',
        location: 'Surabaya, Indonesia',
        bio: 'A designer',
        email: 'jane@example.com',
        phoneNumber: '+628987654321',
        interests: []
      }

      const result = service.createProfile(profileRequest)

      expect(result?.birthdate).toBeInstanceOf(Date)
      expect(result?.birthdate.getFullYear()).toBe(1995)
      expect(result?.birthdate.getMonth()).toBe(5) // June is month 5 (0-indexed)
      expect(result?.birthdate.getDate()).toBe(15)
    })
  })

  describe('getAllProfiles', () => {
    it('should return empty array when no profiles exist', () => {
      const profiles = service.getAllProfiles()
      expect(profiles).toEqual([])
    })

    it('should return all created profiles', () => {
      const profile1: UserProfileRequest = {
        name: 'User 1',
        nickname: 'user1',
        birthdate: '1990-01-01',
        hobbies: [],
        gender: 'Male',
        location: 'City 1',
        bio: 'Bio 1',
        email: 'user1@example.com',
        phoneNumber: '+1234567890',
        interests: []
      }

      const profile2: UserProfileRequest = {
        name: 'User 2',
        nickname: 'user2',
        birthdate: '1992-02-02',
        hobbies: [],
        gender: 'Female',
        location: 'City 2',
        bio: 'Bio 2',
        email: 'user2@example.com',
        phoneNumber: '+1234567891',
        interests: []
      }

      service.createProfile(profile1)
      service.createProfile(profile2)

      const profiles = service.getAllProfiles()
      expect(profiles).toHaveLength(2)
    })
  })

  describe('getProfile', () => {
    it('should return profile by id', () => {
      const profileRequest: UserProfileRequest = {
        name: 'Test User',
        nickname: 'testuser',
        birthdate: '1990-01-01',
        hobbies: [],
        gender: 'Male',
        location: 'Test City',
        bio: 'Test Bio',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        interests: []
      }

      const created = service.createProfile(profileRequest)
      const found = service.getProfile(created!.id)

      expect(found).toBe(created)
    })

    it('should return undefined for non-existent id', () => {
      const found = service.getProfile('non-existent-id')
      expect(found).toBeUndefined()
    })
  })

  describe('deleteProfile', () => {
    it('should delete existing profile and return true', () => {
      const profileRequest: UserProfileRequest = {
        name: 'To Delete',
        nickname: 'todelete',
        birthdate: '1990-01-01',
        hobbies: [],
        gender: 'Male',
        location: 'Delete City',
        bio: 'Will be deleted',
        email: 'delete@example.com',
        phoneNumber: '+1234567890',
        interests: []
      }

      const created = service.createProfile(profileRequest)
      const deleted = service.deleteProfile(created!.id)

      expect(deleted).toBe(true)
      expect(service.getProfile(created!.id)).toBeUndefined()
    })

    it('should return false for non-existent profile', () => {
      const deleted = service.deleteProfile('non-existent-id')
      expect(deleted).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('should update existing profile', () => {
      const profileRequest: UserProfileRequest = {
        name: 'Original Name',
        nickname: 'original',
        birthdate: '1990-01-01',
        hobbies: [],
        gender: 'Male',
        location: 'Original City',
        bio: 'Original Bio',
        email: 'original@example.com',
        phoneNumber: '+1234567890',
        interests: []
      }

      const created = service.createProfile(profileRequest)
      const originalUpdatedAt = created!.updatedAt

      // Wait a bit to ensure updatedAt changes
      vi.useFakeTimers()
      vi.advanceTimersByTime(1000)

      const updates = {
        name: 'Updated Name',
        bio: 'Updated Bio'
      }

      const updated = service.updateProfile(created!.id, updates)

      expect(updated).not.toBeNull()
      expect(updated?.name).toBe('Updated Name')
      expect(updated?.bio).toBe('Updated Bio')
      expect(updated?.nickname).toBe('original') // unchanged
      expect(updated?.updatedAt).not.toBe(originalUpdatedAt)

      vi.useRealTimers()
    })

    it('should return undefined for non-existent profile', () => {
      const updated = service.updateProfile('non-existent-id', { name: 'New Name' })
      expect(updated).toBeUndefined()
    })
  })
})