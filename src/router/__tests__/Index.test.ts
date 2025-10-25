import { describe, it, expect } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import router from '../index'
import HomeView from '../../views/HomeView.vue'
// Update the import path if ProfileView.vue is located elsewhere, for example:
import ProfileView from '../../views/ProfileView.vue'
// Or, if the file does not exist, create ProfileView.vue in the correct directory.

describe('Router', () => {
  it('should have correct route configuration', () => {
    const routes = router.getRoutes()
    // Current app has 9 routes (home, posts list/detail/add/edit, profiles list/detail/add/edit)
    expect(routes).toHaveLength(9)

    // Home route
    const homeRoute = routes.find(route => route.path === '/')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.name).toBe('home')
    expect(homeRoute?.components?.default).toBe(HomeView)

    // Profiles list route
    const profilesRoute = routes.find(route => route.path === '/profiles')
    expect(profilesRoute).toBeDefined()
    expect(profilesRoute?.name).toBe('profile')
    expect(profilesRoute?.components?.default).toBe(ProfileView)

    // Create profile
    const createProfileRoute = routes.find(route => route.path === '/profiles/add')
    expect(createProfileRoute).toBeDefined()
    expect(createProfileRoute?.name).toBe('create-profile')

    // Edit profile
    const editProfileRoute = routes.find(route => route.path === '/profiles/:id/edit')
    expect(editProfileRoute).toBeDefined()
    expect(editProfileRoute?.name).toBe('edit-profile')

    // Detail profile
    const detailProfileRoute = routes.find(route => route.path === '/profiles/:id')
    expect(detailProfileRoute).toBeDefined()
    expect(detailProfileRoute?.name).toBe('detail-profile')

    // Posts routes sanity check
    expect(routes.find(r => r.path === '/posts')).toBeDefined()
    expect(routes.find(r => r.path === '/posts/add')).toBeDefined()
    expect(routes.find(r => r.path === '/posts/:id')).toBeDefined()
    expect(routes.find(r => r.path === '/posts/:id/edit')).toBeDefined()
  })

  it('should navigate to home route', async () => {
    router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('should navigate to profiles route', async () => {
    await router.push('/profiles')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/profiles')
    expect(router.currentRoute.value.name).toBe('profile')
  })

  it('should use web history mode', () => {
    expect(router.options.history.location).toBeDefined()
  })

  it('should use correct base URL from environment', () => {
    // The router uses import.meta.env.BASE_URL
    expect(router.options.history.base).toBeDefined()
  })

  it('should handle route navigation programmatically', async () => {
    // Start at home
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('home')

    // Navigate to profiles
    await router.push('/profiles')
    expect(router.currentRoute.value.name).toBe('profile')

    // Navigate back to home
    await router.push({ name: 'home' })
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should handle route navigation by name', async () => {
    await router.push({ name: 'profile' })
    expect(router.currentRoute.value.name).toBe('profile')
    expect(router.currentRoute.value.path).toBe('/profiles')
  })

  it('should maintain route state during navigation', async () => {
    await router.push('/')
    const homeRoute = router.currentRoute.value

    await router.push('/profiles')
    const profilesRoute = router.currentRoute.value

    expect(homeRoute.path).not.toBe(profilesRoute.path)
    expect(homeRoute.name).not.toBe(profilesRoute.name)
  })
})