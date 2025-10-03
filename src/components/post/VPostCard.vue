<script setup lang="ts">
import VDeletePostButton from './VDeletePostButton.vue';
import VLikeButton from './VLikeButton.vue';
import { format } from 'date-fns';
import { postService } from '@/services/post.service';
import type { Post } from '@/interfaces/post.interface';

const emit = defineEmits(['deleted']);

const props = defineProps({
  post: { type: Object as () => Post, required: true },
  currentUserId: { type: String, required: true },
});

const handleDeleted = () => emit('deleted', props.post.id);
</script>

<template>
  <div class="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col">
    <RouterLink :to="`/posts/${post.id}`" class="block aspect-square overflow-hidden rounded-xl">
      <img :src="post.imageUrl" :alt="post.caption" class="w-full h-full object-cover" />
    </RouterLink>
    <div class="p-3 flex flex-col gap-2">
      <p class="font-semibold text-sm">@{{ post.userId }}</p>
      <p class="text-xs line-clamp-2">{{ post.caption }}</p>
      <p class="text-[10px] text-gray-500">{{ format(new Date(post.createdAt), 'dd MMM yyyy HH:mm') }}</p>
      <div class="flex items-center justify-between pt-1">
        <VLikeButton :post-id="post.id" :current-user-id="currentUserId" />
        <div class="flex gap-1">
          <RouterLink :to="`/posts/${post.id}/edit`" class="text-xs text-blue-600 hover:underline">Edit</RouterLink>
          <VDeletePostButton :post-id="post.id" @deleted="handleDeleted" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
