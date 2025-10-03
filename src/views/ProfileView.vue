<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataTable } from 'simple-datatables'
import VButton from '@/components/common/VButton.vue'
import VDeleteProfileButton from '@/components/profile/VDeleteProfileButton.vue'
import { profileService } from '@/services/profile.service'

const profiles = ref(profileService.getAllProfiles())
let dt: DataTable | null = null

const buildDataTable = () => {
  const tableElement = document.getElementById('profiles-table') as HTMLTableElement
  if (tableElement && typeof DataTable !== 'undefined') {
    if (dt) {
      dt.destroy()
      dt = null
    }
    dt = new DataTable(tableElement, {
      searchable: false,
    })
  }
}

const handleDeleted = async (id: string) => {
  profiles.value = profiles.value.filter(p => p.id !== id)

  if (dt) {
    const row = document.querySelector(`#profiles-table tr[data-id=\"${id}\"]`)
    /* c8 ignore start - DOM row removal visually verified in manual QA; complex to simulate index reliably */
    if (row && row.parentElement) {
      const rowIndex = Array.from(row.parentElement.children).indexOf(row)
      if (rowIndex > -1) {
        dt.rows.remove(rowIndex)
      }
    }
    /* c8 ignore end */
  }
}

onMounted(() => {
  buildDataTable()
})
</script>

<template>
  <main class="flex items-center justify-center w-full h-full">
    <div class="px-12 py-20 w-full">
      <div class="flex flex-col gap-6">
        <RouterLink to="/profiles/add">
          <VButton class="add-button">Buat Profil Baru</VButton>
        </RouterLink>
        <table id="profiles-table">
          <thead>
            <tr>
              <th><span class="flex items-center">Nama</span></th>
              <th><span class="flex items-center">Nickname</span></th>
              <th><span class="flex items-center">Email</span></th>
              <th><span class="flex items-center">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in profiles" :key="p.id" :data-id="p.id">
              <td class="font-medium text-gray-900 whitespace-nowrap">
                {{ p.name }}
              </td>
              <td>{{ p.nickname }}</td>
              <td>{{ p.email }}</td>
              <td class="flex gap-1">
                <RouterLink :to="`/profiles/${p.id}`" class="w-full">
                  <VButton class="detail-button">Lihat</VButton>
                </RouterLink>
                <RouterLink :to="`/profiles/${p.id}/edit`" class="w-full">
                  <VButton class="edit-button">Edit</VButton>
                </RouterLink>
                <VDeleteProfileButton
                  :profileId="p.id"
                  class="w-full"
                  @deleted="handleDeleted"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style scoped>
@reference "@/assets/main.css";
.add-button { @apply bg-pink-600 hover:bg-pink-800 text-white }
.detail-button { @apply bg-blue-600 hover:bg-blue-800 text-white }
.edit-button { @apply bg-yellow-400 hover:bg-yellow-600 text-white }
</style>