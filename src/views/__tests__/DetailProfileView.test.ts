import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import DetailProfileView from '../DetailProfileView.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useUserProfileStore } from '../../stores/profile/profile.store'

// No external service; we spy store methods

// Mock date-fns format to keep deterministic output
vi.mock('date-fns', () => ({
  format: vi.fn(() => 'Formatted Date')
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/profiles/:id', component: DetailProfileView },
    { path: '/profiles', component: { template: '<div>Profiles</div>' } },
    { path: '/profiles/:id/edit', component: { template: '<div>Edit Profile</div>' } }
  ]
})

describe('DetailProfileView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  const mockProfile = {
    id: 'test-profile-id',
    name: 'John Doe',
    nickname: 'johndoe',
    birthdate: new Date('1990-01-01'),
    gender: 'Male',
    location: 'Jakarta, Indonesia',
    bio: 'A software developer',
    hobbies: ['reading', 'gaming'],
    interests: ['technology', 'sports'],
    email: 'john@example.com',
    phoneNumber: '+628123456789',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01'),
    isActive: true
  }

  it('should render correctly with profile data', async () => {
  const s1 = useUserProfileStore()
  vi.spyOn(s1, 'getProfileById').mockResolvedValue(mockProfile as any)

    router.push('/profiles/test-profile-id')
    await router.isReady()

    const wrapper = mount(DetailProfileView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('h1').text()).toBe('Detail Profil')
    expect(wrapper.find('h1').classes()).toContain('text-pink-600')
  })

  it('should display profile information correctly', async () => {
  const store = useUserProfileStore()
  vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)

    router.push('/profiles/test-profile-id')
    await router.isReady()
    const wrapper = mount(DetailProfileView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const html = wrapper.html()
    expect(html).toContain('Nama Lengkap')
    expect(html).toContain('Panggilan')
    expect(html).toContain('Tanggal Lahir')
    expect(html).toContain('Jenis Kelamin')
    expect(html).toContain('Lokasi')
    expect(html).toContain('Status')
    expect(html).toContain('Bio')
    expect(html).toContain('Hobi')
    expect(html).toContain('Minat')
    expect(html).toContain('Email')
    expect(html).toContain('No. Telepon')
  })

  it('should have correct layout structure', async () => {
  const store = useUserProfileStore()
  vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)

    router.push('/profiles/test-profile-id')
    await router.isReady()
    const wrapper = mount(DetailProfileView, { global: { plugins: [router] } })

    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('main').classes()).toContain('w-full')
    expect(wrapper.find('main').classes()).toContain('min-h-screen')
    expect(wrapper.find('main').classes()).toContain('bg-pink-500/20')
  })

  it('should have action buttons', async () => {
  const store = useUserProfileStore()
  vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)
    router.push('/profiles/test-profile-id')
    await router.isReady()
    const wrapper = mount(DetailProfileView, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    const buttonTexts = buttons.map(b => b.text())
    expect(buttonTexts).toContain('Kembali')
    expect(buttonTexts).toContain('Edit')
  })

  it('should have RouterLink to edit page', async () => {
    const store = useUserProfileStore()
    vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)
    router.push('/profiles/test-profile-id')
    await router.isReady()
    const wrapper = mount(DetailProfileView, { global: { plugins: [router, createPinia()] } })
    await wrapper.vm.$nextTick()
    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.exists()).toBe(true)
    expect(routerLink.props('to')).toBe('/profiles/test-profile-id/edit')
  })

  it('should call store.getProfileById on mount', async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useUserProfileStore()
  const spy = vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)
    router.push('/profiles/test-profile-id')
    await router.isReady()
  mount(DetailProfileView, { global: { plugins: [router, pinia] } })
    expect(spy).toHaveBeenCalledWith('test-profile-id')
  })

  it('should redirect handling when profile not found (calls getProfile with id)', async () => {
    vi.clearAllMocks()
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useUserProfileStore()
  vi.spyOn(store, 'getProfileById').mockResolvedValue(undefined as any)
    const testRouter = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/profiles/:id', component: DetailProfileView },
        { path: '/profiles', component: { template: '<div>Profiles</div>' } }
      ]
    })
    await testRouter.push('/profiles/non-existent-id')
    await testRouter.isReady()
  const wrapper = mount(DetailProfileView, { global: { plugins: [testRouter, pinia] } })
    await wrapper.vm.$nextTick()
  expect(store.getProfileById).toHaveBeenCalledWith('non-existent-id')
  })

  it('should handle inactive status display', async () => {
    const inactive = { ...mockProfile, isActive: false }
  const store = useUserProfileStore()
  vi.spyOn(store, 'getProfileById').mockResolvedValue(inactive as any)
    router.push('/profiles/test-profile-id')
    await router.isReady()
  const wrapper = mount(DetailProfileView, { global: { plugins: [router, createPinia()] } })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('Status')
  })

  it('should call router.back() when back button clicked', async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useUserProfileStore()
  vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)
    router.push('/profiles/test-profile-id')
    await router.isReady()
  const wrapper = mount(DetailProfileView, { global: { plugins: [router, pinia] } })
    await wrapper.vm.$nextTick()
    const routerBackSpy = vi.spyOn((wrapper.vm as any).$router, 'back')
    const backButton = wrapper.findAll('button').find(b => b.text() === 'Kembali')
    expect(backButton).toBeDefined()
    await backButton!.trigger('click')
    expect(routerBackSpy).toHaveBeenCalled()
  })

  it('should allow direct getProfile function call (coverage)', async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useUserProfileStore()
  const spy = vi.spyOn(store, 'getProfileById').mockResolvedValue(mockProfile as any)
    router.push('/profiles/test-profile-id')
    await router.isReady()
  const wrapper = mount(DetailProfileView, { global: { plugins: [router, pinia] } })
  await (wrapper.vm as any).getProfile?.()
  expect(spy).toHaveBeenCalledWith('test-profile-id')
  })
})