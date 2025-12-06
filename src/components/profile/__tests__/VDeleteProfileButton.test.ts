import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VDeleteProfileButton from '../VDeleteProfileButton.vue'

// Minimal mock for Pinia store used by the component
const deleteProfileMock = vi.fn()
let errorRef: { error: string | null }

vi.mock('@/stores/profile/profile.store', () => ({
  useUserProfileStore: () => {
    return {
      deleteProfile: deleteProfileMock,
      get error() {
        return errorRef.error
      },
      set error(val: string | null) {
        errorRef.error = val
      },
    }
  }
}))

describe('VDeleteProfileButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    errorRef = { error: null }
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

  it('calls store.deleteProfile when clicked', async () => {
    deleteProfileMock.mockResolvedValue(undefined)

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(deleteProfileMock).toHaveBeenCalledWith('test-profile-id')
    expect(deleteProfileMock).toHaveBeenCalledTimes(1)
  })

  it('emits deleted event when deletion succeeds (no store error)', async () => {
    deleteProfileMock.mockResolvedValue(undefined)
    errorRef.error = null

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('deleted')).toHaveLength(1)
    expect(wrapper.emitted('deleted')![0]).toEqual(['test-profile-id'])
  })

  it('does not emit deleted when store reports error', async () => {
    deleteProfileMock.mockResolvedValue(undefined)
    errorRef.error = 'boom'

    const wrapper = mount(VDeleteProfileButton, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('deleted')).toBeFalsy()
  })

  it('handles different profile IDs', async () => {
    deleteProfileMock.mockResolvedValue(undefined)

    const wrapper = mount(VDeleteProfileButton, {
      props: {
        profileId: 'different-profile-id'
      }
    })

    await wrapper.find('button').trigger('click')

    expect(deleteProfileMock).toHaveBeenCalledWith('different-profile-id')
    expect(wrapper.emitted('deleted')![0]).toEqual(['different-profile-id'])
  })
})
