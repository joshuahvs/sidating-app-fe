<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VProfileForm from '@/components/profile/VProfileForm.vue'
import type { UserProfileRequest } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'

const route = useRoute()
const router = useRouter()
const userProfileStore = useUserProfileStore()
const id = route.params.id as string
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
  username: '',
  roleName: '',
  isActive: true,
})
onMounted(async () => {
  const existing = await userProfileStore.getProfileById(id)
  if (!existing) {
    router.replace('/profiles')
    return
  }
  profileModel.name = existing.name || ''
  profileModel.nickname = existing.nickname || ''
  profileModel.email = existing.email || ''
  profileModel.phoneNumber = existing.phoneNumber || ''
  profileModel.bio = existing.bio || ''
  profileModel.birthdate = existing.birthdate
    ? new Date(existing.birthdate).toISOString().substring(0, 10)
    : ''
  profileModel.gender = existing.gender || ''
  profileModel.location = existing.location || ''
  profileModel.hobbies = existing.hobbies ? [...existing.hobbies] : []
  profileModel.interests = existing.interests ? [...existing.interests] : []
  profileModel.username = existing.username || ''
  profileModel.roleName = existing.roleName || 'User'
  profileModel.isActive = existing.isActive ?? true
})
const updateProfile = async (bodyRequest: UserProfileRequest) => {
  const result = await userProfileStore.updateProfile({
    id,
    ...bodyRequest,
  })
  if (result) {
    router.push('/profiles')
  }
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div
      class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-pink-600 font-bold text-xl">Edit Profil</h1>
      <VProfileForm :profileModel="profileModel" :action="updateProfile" />
    </div>
  </main>
</template>

<style scoped>
/* view specific overrides (none) */
</style>