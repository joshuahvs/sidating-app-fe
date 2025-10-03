<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ label?: string }>(), { label: '' });

const open = ref(false);
</script>

<template>
  <div class="relative inline-block text-left">
    <button type="button" class="dd-btn" @click="open = !open">
      <span>{{ props.label }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
    </button>
    <div v-if="open" class="menu" @click.outside="open=false">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dd-btn { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.375rem 0.75rem; background: white; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.dd-btn:hover { background: #f9fafb; }
.menu { position: absolute; right: 0; margin-top: 0.5rem; width: 12rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; z-index: 10; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1); }
</style>
