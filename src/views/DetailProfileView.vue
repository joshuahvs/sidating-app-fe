<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profileService } from '@/services/profile.service'
import { format } from 'date-fns'
import VButton from '@/components/common/VButton.vue'
import type { UserProfile } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'
const route = useRoute()
const router = useRouter()
const userProfileStore = useUserProfileStore()
const { id: profileId } = route.params as { id: string }
const profile = ref(undefined as undefined | UserProfile)
const getProfile = async () => {
  const getUserProfileResponse = await userProfileStore.getProfileById(profileId as string)
  profile.value = getUserProfileResponse ?? undefined
}
onMounted(async () => {
  await getProfile()
  if (!profile.value) {
    router.replace('/profiles')
  }
})
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-3xl flex flex-col gap-4 bg-white drop-shadow-xl p-6 md:p-8 rounded-2xl divide-y">
      <div class="w-full flex justify-between">
        <h1 class="text-pink-600 font-bold text-xl">Detail Profil</h1>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-6">
        <div>
          <span class="text-sm text-gray-500">Nama Lengkap</span>
          <p class="text-lg font-bold">{{ profile?.name }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Panggilan</span>
          <p class="text-lg font-bold">{{ profile?.nickname }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Tanggal Lahir</span>
          <p class="text-lg font-bold">
            {{ profile ? format(new Date(profile.birthdate), 'EEEE, dd MMMM yyyy') : "-" }}
          </p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Jenis Kelamin</span>
          <p class="text-lg font-bold">{{ profile?.gender }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Lokasi</span>
          <p class="text-lg font-bold">{{ profile?.location }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Status</span>
          <p class="text-lg font-bold">
            {{ profile?.isActive ? "Aktif" : "Nonaktif" }}
          </p>
        </div>
        <div class="md:col-span-2">
          <span class="text-sm text-gray-500">Bio</span>
          <p class="text-lg font-bold">{{ profile?.bio }}</p>
        </div>
        <div class="md:col-span-2">
          <span class="text-sm text-gray-500">Hobi</span>
          <p class="text-lg font-bold">{{ profile?.hobbies }}</p>
        </div>
        <div class="md:col-span-2">
          <span class="text-sm text-gray-500">Minat</span>
          <p class="text-lg font-bold">{{ profile?.interests }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Email</span>
          <p class="text-lg font-bold">{{ profile?.email }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">No. Telepon</span>
          <p class="text-lg font-bold">{{ profile?.phoneNumber }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Dibuat Pada</span>
          <p class="text-lg font-bold">
            {{ profile ? format(new Date(profile.createdAt), 'EEEE, dd MMMM yyyy') : "-" }}
          </p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Terakhir Diperbarui</span>
          <p class="text-lg font-bold">
            {{ profile ? format(new Date(profile.updatedAt), 'EEEE, dd MMMM yyyy') : "-" }}
          </p>
        </div>
      </div>
      <div class="flex gap-4 pt-6">
        <VButton @click="router.back()" class="bg-slate-600 hover:bg-slate-800 text-white">Kembali</VButton>
        <RouterLink :to="`/profiles/${profileId}/edit`" class="w-full">
          <VButton class="bg-pink-600 hover:bg-pink-800 text-white w-full">Edit</VButton>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>