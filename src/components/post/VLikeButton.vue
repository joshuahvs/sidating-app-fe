<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { usePostStore } from '@/stores/post/post.store';

const emit = defineEmits(['liked']);

const props = defineProps({
  postId: { type: String, required: true },
  currentUserId: { type: String, required: true },
});

const liked = ref(false);
const likesCount = ref(0);
const postStore = usePostStore();

watchEffect(() => {
  const post = postStore.posts.find(p => p.id === props.postId);
  if (post) {
    likesCount.value = post.likes.length;
    liked.value = post.likes.includes(props.currentUserId);
  }
});

const toggleLike = async () => {
  const updated = await postStore.likePost(props.postId, props.currentUserId);
  if (updated) {
    likesCount.value = updated.likes.length;
    liked.value = updated.likes.includes(props.currentUserId);
    emit('liked', { postId: props.postId, liked: liked.value });
  }
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
