<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { profileService } from '@/services/profile.service'
import { toast } from 'vue-sonner'

const emit = defineEmits(['deleted'])

const { profileId } = defineProps({
  profileId: {
    type: String,
    required: true,
  },
})

const deleteProfile = () => {
  const removed = profileService.deleteProfile(profileId)
  if (removed) {
    toast.success('Profile deleted successfully')
    emit('deleted', profileId)
  } else {
    toast.error('Failed to delete profile')
  }
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