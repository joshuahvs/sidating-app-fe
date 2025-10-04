<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { h, resolveComponent } from 'vue'
import VButton from '@/components/common/VButton.vue'
import VDeleteProfileButton from '@/components/profile/VDeleteProfileButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'

import { onMounted } from 'vue'
import type { UserProfile } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'


const userProfileStore = useUserProfileStore()
const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: 'name',
    header: 'Nama',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'nickname',
    header: 'Nickname',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: (info) => {
      const profile = info.row.original
      const RouterLink = resolveComponent('RouterLink')
      return h('div', { class: 'flex gap-2 w-full' }, [
        h(
          RouterLink,
          { to: `/profiles/${profile.id}`, class: 'flex-1' },
          {
            default: () =>
              h(
                VButton,
                { class: 'w-full bg-blue-500 hover:bg-blue-600 text-white' },
                { default: () => 'Lihat' },
              ),
          },
        ),
        h(
          RouterLink,
          { to: `/profiles/${profile.id}/edit`, class: 'flex-1' },
          {
            default: () =>
              h(
                VButton,
                { class: 'w-full bg-yellow-400 hover:bg-yellow-500 text-white' },
                { default: () => 'Edit' },
              ),
          },
        ),
        h('div', { class: 'flex-1' }, [
          h(VDeleteProfileButton, {
            class: 'w-full',
            profileId: profile.id,
          }),
        ]),
      ])
    },
  },
]
onMounted(async () => {
  await userProfileStore.fetchProfiles()
})
</script>

<template>
  <main class="flex items-center justify-center w-full min-h-screen bg-gray-50">
    <div class="px-4 md:px-12 py-10 md:py-20 w-full">
      <div class="flex flex-col gap-6">
        <div class="flex justify-start">
          <RouterLink to="/profiles/add">
            <VButton class="add-button">Buat Profil Baru</VButton>
          </RouterLink>
        </div>

        <VDataTable :data="userProfileStore.profiles" :columns="columns" :page-size="10" />
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "@/assets/main.css";
.add-button {
  @apply bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-lg transition-colors;
}
</style>
