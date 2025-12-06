<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { useUserProfileStore } from '@/stores/profile/profile.store'

const emit = defineEmits(['deleted'])

const { profileId } = defineProps({
  profileId: {
    type: String,
    required: true,
  },
})

const userProfileStore = useUserProfileStore()

const deleteProfile = async () => {
  // Delegate deletion to the Pinia store which calls the backend API
  await userProfileStore.deleteProfile(profileId)
  // Emit only when there is no error reported by the store
  if (!userProfileStore.error) emit('deleted', profileId)
}
</script>

<template>
  <VButton @click="deleteProfile" class="del-button">Hapus</VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

.del-button {
  @apply bg-rose-600 hover:bg-rose-800 text-white
}
</style>