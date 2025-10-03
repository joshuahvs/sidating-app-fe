import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../ProfileView.vue'
import { profileService } from '../../services/profile.service'

// Mock the profile service
vi.mock('@/services/profile.service', () => ({
  profileService: {
    getAllProfiles: vi.fn()
  }
}))

// Mock DataTable
vi.mock('simple-datatables', () => ({
  DataTable: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    rows: vi.fn(() => ({
      remove: vi.fn()
    }))
  }))
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/profiles', component: ProfileView },
    { path: '/profiles/add', component: { template: '<div>Add Profile</div>' } },
    { path: '/profiles/:id', component: { template: '<div>Profile Detail</div>' } },
    { path: '/profiles/:id/edit', component: { template: '<div>Edit Profile</div>' } }
  ]
})

describe('ProfileView', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock DOM methods used by DataTable logic
    Object.defineProperty(document, 'getElementById', {
      writable: true,
      value: vi.fn().mockReturnValue(document.createElement('table'))
    })
    Object.defineProperty(document, 'querySelector', {
      writable: true,
      value: vi.fn().mockReturnValue(document.createElement('tr'))
    })
  })

  const mockProfiles = [
    {
      id: '1',
      name: 'John Doe',
      nickname: 'johndoe',
      birthdate: new Date('1990-01-01'),
      hobbies: ['reading'],
      gender: 'Male',
      location: 'Jakarta',
      bio: 'Developer',
      phoneNumber: '+628123456789',
      interests: ['tech'],
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      nickname: 'janesmith',
      birthdate: new Date('1992-05-15'),
      hobbies: ['painting'],
      gender: 'Female',
      location: 'Surabaya',
      bio: 'Designer',
      phoneNumber: '+628987654321',
      interests: ['art'],
      email: 'jane@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
  ]

  it('should render correctly with profiles', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue(mockProfiles)

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('table#profiles-table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('should display profile data in table rows', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue(mockProfiles)

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    const rows = wrapper.findAll('tbody tr')

    // First profile
    expect(rows[0].findAll('td')[0].text()).toBe('John Doe')
    expect(rows[0].findAll('td')[1].text()).toBe('johndoe')
    expect(rows[0].findAll('td')[2].text()).toBe('john@example.com')

    // Second profile
    expect(rows[1].findAll('td')[0].text()).toBe('Jane Smith')
    expect(rows[1].findAll('td')[1].text()).toBe('janesmith')
    expect(rows[1].findAll('td')[2].text()).toBe('jane@example.com')
  })

  it('should have correct table headers', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue([])

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    const headers = wrapper.findAll('thead th')
    expect(headers[0].text()).toContain('Nama')
    expect(headers[1].text()).toContain('Nickname')
    expect(headers[2].text()).toContain('Email')
    expect(headers[3].text()).toContain('Aksi')
  })

  it('should have action buttons for each profile', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue(mockProfiles)

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    const firstRowActions = wrapper.findAll('tbody tr')[0].findAll('td')[3]
    const routerLinks = firstRowActions.findAllComponents({ name: 'RouterLink' })
    const deleteButton = firstRowActions.findComponent({ name: 'VDeleteProfileButton' })

    expect(routerLinks).toHaveLength(2)
    expect(routerLinks[0].props('to')).toBe('/profiles/1')
    expect(routerLinks[1].props('to')).toBe('/profiles/1/edit')
    expect(deleteButton.exists()).toBe(true)
    expect(deleteButton.props('profileId')).toBe('1')
  })

  it('should have add profile button', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue([])

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    const addButton = wrapper.findComponent({ name: 'RouterLink' })
    expect(addButton.props('to')).toBe('/profiles/add')
    expect(addButton.text()).toBe('Buat Profil Baru')
  })

  it('should handle profile deletion', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue(mockProfiles)

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    // Emit deleted event
    const deleteButton = wrapper.findComponent({ name: 'VDeleteProfileButton' })
    await deleteButton.vm.$emit('deleted', '1')

    expect((wrapper.vm as any).profiles.length).toBe(1)
    expect((wrapper.vm as any).profiles[0].id).toBe('2')
  })

  it('should render empty table when no profiles exist', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue([])

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })

  it('should destroy existing DataTable when rebuilding', async () => {
    const mockGetAllProfiles = vi.mocked(profileService.getAllProfiles)
    mockGetAllProfiles.mockReturnValue(mockProfiles)

    router.push('/profiles')
    await router.isReady()

    const wrapper = mount(ProfileView, {
      global: {
        plugins: [router]
      }
    })

    const mockDestroy = vi.fn()
    const mockDataTable = {
      destroy: mockDestroy,
      rows: vi.fn(() => ({ remove: vi.fn() }))
    }

    ;(wrapper.vm as any).dt = mockDataTable
    ;(wrapper.vm as any).buildDataTable()

    expect(mockDestroy).toHaveBeenCalled()
    expect(mockDestroy).toHaveBeenCalledTimes(1)
  })
})