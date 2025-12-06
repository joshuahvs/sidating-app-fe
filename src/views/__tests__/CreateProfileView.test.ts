import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import CreateProfileView from '../CreateProfileView.vue'
import { toast } from 'vue-sonner'
import { createPinia, setActivePinia } from 'pinia'
import { useUserProfileStore } from '../../stores/profile/profile.store'

// Spy toast

// Mock toast
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/profiles/add', component: CreateProfileView },
    { path: '/profiles', component: { template: '<div>Profiles</div>' } }
  ]
})

describe('CreateProfileView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('should render correctly', async () => {
    router.push('/profiles/add')
    await router.isReady()

    const wrapper = mount(CreateProfileView, {
      global: { plugins: [router] }
    })

    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Tambah Profil')
    expect(wrapper.find('h1').classes()).toContain('text-pink-600')
    expect(wrapper.find('h1').classes()).toContain('font-bold')
    expect(wrapper.find('h1').classes()).toContain('text-xl')
  })

  it('should have proper layout styling', async () => {
    router.push('/profiles/add')
    await router.isReady()

    const wrapper = mount(CreateProfileView, {
      global: { plugins: [router] }
    })

    const main = wrapper.find('main')
    expect(main.classes()).toContain('w-full')
    expect(main.classes()).toContain('min-h-screen')
    expect(main.classes()).toContain('bg-pink-500/20')
    expect(main.classes()).toContain('pt-24')
    expect(main.classes()).toContain('py-10')
    expect(main.classes()).toContain('px-4')

    const container = wrapper.find('div.max-w-3xl')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('mx-auto')
    expect(container.classes()).toContain('w-full')
    expect(container.classes()).toContain('bg-white')
    expect(container.classes()).toContain('shadow-lg')
    expect(container.classes()).toContain('rounded-2xl')
  })

  it('should render VProfileForm component with correct props', async () => {
    router.push('/profiles/add')
    await router.isReady()

    const wrapper = mount(CreateProfileView, {
      global: { plugins: [router] }
    })

    const profileForm = wrapper.findComponent({ name: 'VProfileForm' })
    expect(profileForm.exists()).toBe(true)

    const props = profileForm.props()
    expect(props.profileModel).toBeDefined()
    expect(props.action).toBe((wrapper.vm as any).addProfile)
  })

  it('should initialize profileModel with empty values', async () => {
    router.push('/profiles/add')
    await router.isReady()

    const wrapper = mount(CreateProfileView, {
      global: { plugins: [router] }
    })

    const profileModel = (wrapper.vm as any).profileModel
    expect(profileModel.name).toBe('')
    expect(profileModel.nickname).toBe('')
    expect(profileModel.email).toBe('')
    expect(profileModel.phoneNumber).toBe('')
    expect(profileModel.bio).toBe('')
    expect(profileModel.birthdate).toBe('')
    expect(profileModel.gender).toBe('')
    expect(profileModel.location).toBe('')
    expect(profileModel.hobbies).toEqual([])
    expect(profileModel.interests).toEqual([])
  })

  it('should call store.createProfile when addProfile is called', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useUserProfileStore()
    const mockCreateProfile = vi.spyOn(store, 'createProfile').mockResolvedValue({
      id: 'test-id',
      name: 'Test User',
      nickname: 'testuser',
      email: 'test@example.com',
      phoneNumber: '+628123456789',
      bio: 'Test bio',
      birthdate: new Date('1990-01-01'),
      gender: 'Male',
      location: 'Test City',
      hobbies: ['reading'],
      interests: ['technology'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })

    router.push('/profiles/add')
    await router.isReady()

    const wrapper = mount(CreateProfileView, {
      global: {
        plugins: [router, pinia]
      }
    })

    const pushSpy = vi.spyOn(router, 'push')

    const profileRequest = {
      name: 'Test User',
      nickname: 'testuser',
      email: 'test@example.com',
      phoneNumber: '+628123456789',
      bio: 'Test bio',
      birthdate: '1990-01-01',
      gender: 'Male',
      location: 'Test City',
      hobbies: ['reading'],
      interests: ['technology']
    }

    await (wrapper.vm as any).addProfile(profileRequest)
    await nextTick()
    
    expect(mockCreateProfile).toHaveBeenCalledWith(profileRequest)
    // Navigation asserted via router push
    expect(pushSpy).toHaveBeenCalledWith('/profiles')
  })

  it('should not navigate when profile creation fails', async () => {
    const store = useUserProfileStore()
    const mockCreateProfile = vi.spyOn(store, 'createProfile').mockResolvedValue(undefined as any)

    router.push('/profiles/add')
    await router.isReady()

    const wrapper = mount(CreateProfileView, {
      global: { plugins: [router, createPinia()] }
    })

    const profileRequest = {
      name: 'Test User',
      nickname: 'testuser',
      email: 'test@example.com',
      phoneNumber: '+628123456789',
      bio: 'Test bio',
      birthdate: '1990-01-01',
      gender: 'Male',
      location: 'Test City',
      hobbies: ['reading'],
      interests: ['technology']
    }

    await (wrapper.vm as any).addProfile(profileRequest)
    // No navigation on failure
    expect((wrapper.vm as any).$router.currentRoute.value.path).toBe('/profiles/add')
  })
})