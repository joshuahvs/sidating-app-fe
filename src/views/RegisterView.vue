<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import VInput from '@/components/common/VInput.vue'
import VTextArea from '@/components/common/VTextArea.vue'
import VButton from '@/components/common/VButton.vue'
import VSelect from '@/components/common/VSelect.vue'
import VListInput from '@/components/common/VListInput.vue'
import type { UserProfileRequest } from '@/interfaces/profile.interface'
import { useUserProfileStore } from '@/stores/profile/profile.store'

const router = useRouter()

const userProfileStore = useUserProfileStore()

const profileModel = reactive<UserProfileRequest & { username: string; password: string; roleName: string }>({
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
    password: '',
    roleName: 'User',
})

const handleRegister = async () => {
    const createProfileResponse = await userProfileStore.createProfile(profileModel)

    if (createProfileResponse) {
        router.push('/login')
    }
}
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div
      class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-pink-600 font-bold text-xl">Register</h1>
 
      <form @submit.prevent="handleRegister" class="flex flex-col gap-6 py-4">
        <div class="grid grid-cols-2 gap-4">
          <VInput 
            v-model="profileModel.username" 
            id="username" 
            name="username" 
            label="Username" 
            required
          />
          <VInput 
            v-model="profileModel.password" 
            id="password" 
            name="password" 
            type="password" 
            label="Password" 
            required
          />
        </div>
 
        <div class="grid grid-cols-2 gap-4">
          <VInput v-model="profileModel.name" id="name" name="name" label="Nama" required />
          <VInput v-model="profileModel.nickname" id="nickname" name="nickname" label="Nickname" required />
        </div>
 
        <div class="grid grid-cols-2 gap-4">
          <VInput v-model="profileModel.email" id="email" name="email" type="email" label="Email" required />
          <VInput
            v-model="profileModel.phoneNumber"
            id="phone"
            name="phone"
            type="tel"
            label="Nomor Telepon"
            required
          />
        </div>
 
        <VTextArea v-model="profileModel.bio" id="description" name="description" label="Bio" />
 
        <div class="grid grid-cols-2 gap-4">
          <VInput
            id="birthdate"
            name="birthdate"
            type="date"
            v-model="profileModel.birthdate"
            label="Tanggal Lahir"
            required
          />
          <VSelect id="gender" name="gender" label="Jenis Kelamin" v-model="profileModel.gender" required>
            <option value="">Pilih Jenis Kelamin...</option>
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
            <option value="OTHER">Lainnya</option>
          </VSelect>
        </div>
 
        <VInput v-model="profileModel.location" id="location" name="location" label="Lokasi" required />
 
        <div class="grid grid-cols-2 gap-4">
          <VListInput v-model="profileModel.hobbies" label="Hobi" placeholder="Tambah hobi lalu Enter" />
          <VListInput v-model="profileModel.interests" label="Minat" placeholder="Tambah minat lalu Enter" />
        </div>
 
        <div class="flex justify-end gap-2 pt-4">
          <VButton
            @click="router.push('/login')"
            type="button"
            class="bg-slate-600 hover:bg-slate-800 text-white"
          >
            Kembali ke Login
          </VButton>
          <VButton 
            type="submit" 
            class="bg-pink-600 hover:bg-pink-800 text-white"
            :disabled="userProfileStore.loading"
          >
            {{ userProfileStore.loading ? 'Registering...' : 'Register' }}
          </VButton>
        </div>
      </form>
    </div>
  </main>
</template>
 
<style scoped>
</style>

