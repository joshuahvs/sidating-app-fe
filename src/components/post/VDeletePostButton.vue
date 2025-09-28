<script setup lang="ts">
import VButton from '@/components/common/VButton.vue';
import { postService } from '@/services/post.service';
import { toast } from 'vue-sonner';

const emit = defineEmits(['deleted']);

const { postId } = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const deletePost = () => {
  const removed = postService.deletePost(postId);
  if (removed) {
    toast.success('Post deleted successfully');
    emit('deleted', postId);
  } else {
    toast.error('Failed to delete post');
  }
};
</script>

<template>
  <VButton @click="deletePost" class="del-button">Hapus</VButton>
</template>

<style scoped>
.del-button { background-color: #e11d48; color: white; border-radius: 1rem; padding: 0.25rem 0.75rem; font-weight: 600; font-size: 0.875rem; }
.del-button:hover { background-color: #9f1239; }
</style>
