<script setup lang="ts">
import { RouterLink } from 'vue-router'
import VButton from '@/components/common/VButton.vue';
import { isAuthenticated } from '@/lib/rbac';
</script>

<template>
  <main class="flex items-center justify-center w-full h-screen">
    <div class="flex flex-col w-fit gap-2 items-center">
      <h1 class="text-4xl font-bold">
        Selamat datang di
        <span class="text-pink-600">SiDating</span>
      </h1>
      <div class="w-full flex justify-center gap-2">
        <RouterLink :to="isAuthenticated() ? '/posts' : '/login'" class="w-1/2">
          <VButton class="home-button">
            {{ isAuthenticated() ? 'Ke Halaman Post' : 'Ke Halaman Login' }}
          </VButton>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "@/assets/main.css";

.home-button {
  @apply hover:bg-pink-600 border-2 border-pink-600 text-pink-600
}
</style>
