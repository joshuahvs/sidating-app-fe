import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import VNavbar from '../VNavbar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/profiles', component: { template: '<div>Profiles</div>' } }
  ]
})

describe('VNavbar', () => {
  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  it('should render correctly', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RouterLink' })).toBeDefined()
  })

  it('should have correct header structure and classes', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('fixed')
    expect(header.classes()).toContain('top-0')
    expect(header.classes()).toContain('left-0')
    expect(header.classes()).toContain('flex')
    expect(header.classes()).toContain('items-center')
    expect(header.classes()).toContain('w-full')
    expect(header.classes()).toContain('gap-4')
    expect(header.classes()).toContain('px-3')
    expect(header.classes()).toContain('py-4')
    expect(header.classes()).toContain('bg-white')
    expect(header.classes()).toContain('z-50')
  })

  it('should display SiDating brand link', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const brandLink = wrapper.findAllComponents({ name: 'RouterLink' })[0]
    expect(brandLink.props('to')).toBe('/')
    expect(brandLink.text()).toBe('SiDating')
    expect(brandLink.classes()).toContain('text-xl')
    expect(brandLink.classes()).toContain('font-bold')
    expect(brandLink.classes()).toContain('text-pink-600')
  })

  it('should display Profile navigation link', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const profileLink = wrapper.findAllComponents({ name: 'RouterLink' })[1]
    expect(profileLink.props('to')).toBe('/profiles')
    expect(profileLink.text()).toBe('Profile')
  })

  it('should apply correct classes when on home page', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const profileLink = wrapper.findAllComponents({ name: 'RouterLink' })[1]
    // when not on /profiles, should have default classes
    expect(profileLink.classes()).toContain('text-black')
    expect(profileLink.classes()).toContain('hover:text-pink-600')
    expect(profileLink.classes()).not.toContain('text-pink-600')
  })

  it('should apply active classes when on profiles page', async () => {
    await router.push('/profiles')
    await router.isReady()

    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const profileLink = wrapper.findAllComponents({ name: 'RouterLink' })[1]
    // when on /profiles, should have active class
    expect(profileLink.classes()).toContain('text-pink-600')
    expect(profileLink.classes()).not.toContain('text-black')
  })

  it('should have navigation structure', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('flex')
    expect(nav.classes()).toContain('gap-4')

    const navLinks = nav.findAllComponents({ name: 'RouterLink' })
    expect(navLinks).toHaveLength(1) // Only Profile link is in nav
  })

  it('should call getLinkClass function correctly', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    // Test the getLinkClass function indirectly through the rendered classes
    const profileLink = wrapper.findAllComponents({ name: 'RouterLink' })[1]

    // Should have default classes when not active
    expect(profileLink.classes()).toContain('text-black')
    expect(profileLink.classes()).toContain('hover:text-pink-600')

    // Navigate to profiles page
    await router.push('/profiles')
    await wrapper.vm.$nextTick()

    // Should have active classes when active
    expect(profileLink.classes()).toContain('text-pink-600')
  })

  it('should have all RouterLinks', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' })
    expect(routerLinks).toHaveLength(2) // Brand link + Profile link

    // Check all links are present
    const linkTargets = routerLinks.map(link => link.props('to'))
    expect(linkTargets).toContain('/')
    expect(linkTargets).toContain('/profiles')
  })

  it('should be accessible and semantic', async () => {
    const wrapper = mount(VNavbar, {
      global: { plugins: [router] }
    })

    // Should use semantic HTML elements
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)

    // Links should be properly structured
    const links = wrapper.findAllComponents({ name: 'RouterLink' })
    links.forEach(link => {
      expect(link.text()).toBeTruthy() // All links should have text
    })
  })
})
