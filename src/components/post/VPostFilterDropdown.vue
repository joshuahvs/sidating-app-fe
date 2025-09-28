<script setup lang="ts">
import VDropdown from '@/components/common/VDropdown.vue';

const emit = defineEmits(['change']);

const props = defineProps<{ users: string[] }>();

let selectedUser = '';
let selectedSort = 'desc';

const chooseUser = (u: string) => { selectedUser = u; emit('change', { user: selectedUser, sort: selectedSort }); };
const chooseSort = (s: string) => { selectedSort = s; emit('change', { user: selectedUser, sort: selectedSort }); };
</script>

<template>
  <div class="flex gap-2 items-center">
    <VDropdown label="Filter User">
      <button class="item" @click="chooseUser('')">Semua</button>
      <button v-for="u in props.users" :key="u" class="item" @click="chooseUser(u)">@{{ u }}</button>
    </VDropdown>
    <VDropdown label="Urutkan">
      <button class="item" @click="chooseSort('desc')">Terbaru</button>
      <button class="item" @click="chooseSort('asc')">Terlama</button>
    </VDropdown>
  </div>
</template>

<style scoped>
.item { text-align: left; width: 100%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; }
.item:hover { background: #f3f4f6; }
</style>
