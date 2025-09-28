import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VDeleteProfileButton from '../VDeleteProfileButton.vue'
import { profileService } from '../../../services/profile.service'
import { toast } from 'vue-sonner'

// Mock the profile service using correct alias path
vi.mock('../../../services/profile.service', () => ({
  profileService: {
    deleteProfile: vi.fn()
  }
}))

describe('VDeleteProfileButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    profileId: 'test-profile-id'
  }

  it('should render correctly', () => {
    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toBe('Hapus')
    expect(wrapper.find('button').classes()).toContain('del-button')
  })

  it('should call profileService.deleteProfile when clicked', async () => {
    const mockDeleteProfile = vi.mocked(profileService.deleteProfile)
    mockDeleteProfile.mockReturnValue(true)

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(mockDeleteProfile).toHaveBeenCalledWith('test-profile-id')
    expect(mockDeleteProfile).toHaveBeenCalledTimes(1)
  })

  it('should emit deleted event and show success toast when deletion succeeds', async () => {
    const mockDeleteProfile = vi.mocked(profileService.deleteProfile)
    mockDeleteProfile.mockReturnValue(true)

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('deleted')).toHaveLength(1)
    expect(wrapper.emitted('deleted')![0]).toEqual(['test-profile-id'])
    expect(toast.success).toHaveBeenCalledWith('Profile deleted successfully')
  })

  it('should show error toast when deletion fails', async () => {
    const mockDeleteProfile = vi.mocked(profileService.deleteProfile)
    mockDeleteProfile.mockReturnValue(false)

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('deleted')).toBeFalsy()
    expect(toast.error).toHaveBeenCalledWith('Failed to delete profile')
  })

  it('should not emit deleted event when deletion fails', async () => {
    const mockDeleteProfile = vi.mocked(profileService.deleteProfile)
    mockDeleteProfile.mockReturnValue(false)

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('deleted')).toBeFalsy()
  })

  it('should handle different profile IDs', async () => {
    const mockDeleteProfile = vi.mocked(profileService.deleteProfile)
    mockDeleteProfile.mockReturnValue(true)

    const wrapper = mount(VDeleteProfileButton, {
      props: {
        profileId: 'different-profile-id'
      }
    })

    await wrapper.find('button').trigger('click')

    expect(mockDeleteProfile).toHaveBeenCalledWith('different-profile-id')
    expect(wrapper.emitted('deleted')![0]).toEqual(['different-profile-id'])
  })
})
