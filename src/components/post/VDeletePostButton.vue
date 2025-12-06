<script setup lang="ts">
import VButton from '@/components/common/VButton.vue';
import { usePostStore } from '@/stores/post/post.store';

const emit = defineEmits(['deleted']);

const { postId } = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const postStore = usePostStore();

const deletePost = async () => {
  const removed = await postStore.deletePost(postId);
  if (removed) emit('deleted', postId);
};
</script>

<template>
  <VButton @click="deletePost" class="del-button">Hapus</VButton>
</template>

<style scoped>
.del-button { background-color: #e11d48; color: white; border-radius: 1rem; padding: 0.25rem 0.75rem; font-weight: 600; font-size: 0.875rem; }
.del-button:hover { background-color: #9f1239; }
</style>
