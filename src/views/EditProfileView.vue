<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profileService } from '@/services/profile.service'
import VProfileForm from '@/components/profile/VProfileForm.vue'
import type { UserProfileRequest } from '@/interfaces/profile.interface'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string
const existing = profileService.getProfile(id)

if (!existing) {
  router.replace('/profiles')
}

const profileModel = reactive<UserProfileRequest>({
  name: existing?.name || '',
  nickname: existing?.nickname || '',
  email: existing?.email || '',
  phoneNumber: existing?.phoneNumber || '',
  bio: existing?.bio || '',
  birthdate: existing?.birthdate ? new Date(existing.birthdate).toISOString().substring(0, 10) : '',
  gender: existing?.gender || '',
  location: existing?.location || '',
  hobbies: existing?.hobbies ? [...existing.hobbies] : [],
  interests: existing?.interests ? [...existing.interests] : [],
})

const updateProfile = async (bodyRequest: UserProfileRequest) => {
  if (await profileService.updateProfile(id, bodyRequest)) {
    toast.success('Profile updated successfully')
  } else {
    toast.error('Failed to update profile')
  }
  router.push('/profiles')
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Edit Profil</h1>
      <VProfileForm :profileModel="profileModel" :action="updateProfile" />
    </div>
  </main>
</template>