<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { postService } from '@/services/post.service';

const emit = defineEmits(['liked']);

const props = defineProps({
  postId: { type: String, required: true },
  currentUserId: { type: String, required: true },
});

const liked = ref(false);
const likesCount = ref(0);

watchEffect(() => {
  const post = postService.getPost(props.postId);
  if (post) {
    likesCount.value = post.likes.length;
    liked.value = post.likes.includes(props.currentUserId);
  }
});

const toggleLike = () => {
  const post = postService.getPost(props.postId);
  if (!post) return;
  if (liked.value) {
    post.likes = post.likes.filter(u => u !== props.currentUserId);
  } else {
    postService.likePost(props.postId, props.currentUserId);
  }
  // refresh state
  likesCount.value = post.likes.length;
  liked.value = post.likes.includes(props.currentUserId);
  emit('liked', { postId: props.postId, liked: liked.value });
};
</script>

<template>
  <button @click="toggleLike" class="like-btn" :aria-pressed="liked">
    <span v-if="liked" class="text-rose-600">♥</span>
    <span v-else class="text-gray-400">♡</span>
    <span class="ml-1 text-sm font-medium">{{ likesCount }}</span>
  </button>
</template>

<style scoped>
.like-btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; padding: 0.25rem 0.5rem; transition: background-color 150ms; }
.like-btn:hover { background: #ffe4e6; }
button[aria-pressed="true"] .text-rose-600 { font-weight: 600; }
</style>
