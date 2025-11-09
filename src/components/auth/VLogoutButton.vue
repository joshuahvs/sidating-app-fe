<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  try {
    authStore.logout()
    router.push('/login')
  } catch (error) {
    toast.error('Logout failed')
  }
}
</script>

<template>
  <VButton @click="handleLogout" class="bg-red-600 hover:bg-red-800 text-white px-6 py-2 rounded-xs">
    Logout
  </VButton>
</template>