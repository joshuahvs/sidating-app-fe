<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import VProfileForm from '@/components/profile/VProfileForm.vue'
import type { UserProfileRequest } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'

const router = useRouter()
const userProfileStore = useUserProfileStore()
const profileModel = reactive<UserProfileRequest>({
  name: '',
  nickname: '',
  email: '',
  phoneNumber: '',
  bio: '',
  birthdate: '',
  gender: '',
  location: '',
  hobbies: [],
  interests: [],
})
const addProfile = async (bodyRequest: UserProfileRequest) => {
  const createProfileResponse = await userProfileStore.createProfile(bodyRequest)
  if (createProfileResponse) {
    router.push('/profiles')
  }
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div
      class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-pink-600 font-bold text-xl">Tambah Profil</h1>
      <VProfileForm :profileModel="profileModel" :action="addProfile" />
    </div>
  </main>
</template>

<style scoped>
/* view specific overrides (none) */
</style>