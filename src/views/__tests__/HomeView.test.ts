import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'

// Create a mock router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/profiles', component: { template: '<div>Profiles</div>' } }
  ]
})

describe('HomeView', () => {
  it('should render correctly', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('Selamat datang di')
    expect(wrapper.find('h1 span').text()).toBe('SiDating')
    expect(wrapper.find('h1 span').classes()).toContain('text-pink-600')
  })

  it('should have a router link to login', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.exists()).toBe(true)
    // When not authenticated, should link to /login
    expect(routerLink.props('to')).toBe('/login')
  })

  it('should have a button with correct text', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })

    // Find button by its actual element since VButton renders as button
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    // When not authenticated, should show login text
    expect(button.text()).toBe('Ke Halaman Login')
    expect(button.classes()).toContain('home-button')
  })

  it('should have proper layout structure', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('main').classes()).toContain('flex')
    expect(wrapper.find('main').classes()).toContain('items-center')
    expect(wrapper.find('main').classes()).toContain('justify-center')
    expect(wrapper.find('main').classes()).toContain('w-full')
    expect(wrapper.find('main').classes()).toContain('h-screen')
  })

  it('should have proper styling classes', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })

    const title = wrapper.find('h1')
    expect(title.classes()).toContain('text-4xl')
    expect(title.classes()).toContain('font-bold')

    const span = wrapper.find('h1 span')
    expect(span.classes()).toContain('text-pink-600')
  })
})