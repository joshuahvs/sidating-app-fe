<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import VLogoutButton from '../auth/VLogoutButton.vue'
import VButton from '../common/VButton.vue'
import { isAuthenticated, isAdmin } from '@/lib/rbac'
import { getCurrentUser } from '@/lib/auth'
import { computed } from 'vue'

const route = useRoute()
const userId = getCurrentUser()?.id

// Profile link redirects to /profiles for admin, /profiles/:userId for regular user
const profileLink = computed(() => {
  return isAdmin() ? '/profiles' : `/profiles/${userId}`
})

const getLinkClass = (path: string) =>
  route.path === path ? 'text-pink-600' : 'text-black hover:text-pink-600'
</script>

<template>
  <header class="fixed top-0 left-0 flex items-center w-full gap-4 px-3 py-4 bg-white z-50">
    <RouterLink to="/" class="text-xl font-bold text-pink-600">SiDating</RouterLink>

    <div v-if="isAuthenticated()">
      <nav class="flex gap-4">
        <RouterLink :to="profileLink" :class="getLinkClass(profileLink)">
          {{ isAdmin() ? 'Profile' : 'My Profile' }}
        </RouterLink>
        <RouterLink to="/posts" :class="getLinkClass('/posts')">Post</RouterLink>
      </nav>
    </div>

    <div class="ml-auto">
      <div v-if="isAuthenticated()">
        <VLogoutButton />
      </div>
      <RouterLink v-else to="/login" :class="getLinkClass('/login')">
        <VButton class="bg-pink-600 hover:bg-pink-800 text-white px-4 py-2 rounded-xs">
          Login
        </VButton>
      </RouterLink>
    </div>
  </header>
</template>