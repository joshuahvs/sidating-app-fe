<script setup lang="ts">
import { RouterLink } from 'vue-router'
import VButton from '@/components/common/VButton.vue';
</script>

<template>
  <main class="flex items-center justify-center w-full h-screen">
    <div class="flex flex-col w-fit gap-2 items-center">
      <h1 class="text-4xl font-bold">
        Selamat datang di
        <span class="text-pink-600">SiDating</span>
      </h1>
      <div class="w-full flex justify-center gap-2">
        <RouterLink to="/profiles" class="w-1/2">
          <VButton class="home-button">Ke Halaman Profile</VButton>
        </RouterLink>
      </div>
    </div>
  </main>
</template>