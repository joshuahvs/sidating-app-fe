<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/post/post.store';
import VButton from '@/components/common/VButton.vue';
import VDeletePostButton from '@/components/post/VDeletePostButton.vue';
import VLikeButton from '@/components/post/VLikeButton.vue';
import { format } from 'date-fns';
import type { Post } from '@/interfaces/post.interface';
import { getCurrentUser } from '@/lib/auth';

const route = useRoute();
const router = useRouter();

const { id: postId } = route.params as { id: string };
const currentUser = getCurrentUser();
const currentUserId = currentUser?.id || '';

// Local fallback; primary source will be store
const post = ref<Post | undefined>(undefined);
const postStore = usePostStore();

onMounted(async () => {
  const p = await postStore.getPostById(postId);
  if (!p) {
    router.replace('/posts');
    return;
  }
  // Ensure the store contains this post so VLikeButton can react to likes
  const idx = postStore.posts.findIndex(x => x.id === p.id);
  if (idx === -1) postStore.posts.push(p); else postStore.posts[idx] = p;
  post.value = p;
});

// Always read the post from the store if available so likes update live
const storePost = computed(() => postStore.posts.find(p => p.id === postId));
const effectivePost = computed<Post | undefined>(() => storePost.value || post.value);
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-4xl flex flex-col gap-6 bg-white p-6 md:p-10 rounded-2xl shadow">
      <div class="flex justify-between items-center">
        <h1 class="text-pink-600 font-bold text-xl">Detail Post</h1>
        <div class="flex gap-2">
          <VButton @click="router.back()" class="bg-slate-600 hover:bg-slate-800 text-white w-full">Kembali</VButton>
          <RouterLink :to="`/posts/${postId}/edit`" class="w-full"><VButton class="bg-blue-600 hover:bg-blue-800 text-white w-full">Edit</VButton></RouterLink>
          <VDeletePostButton :post-id="postId" @deleted="() => router.push('/posts')" />
        </div>
      </div>
      <div v-if="effectivePost" class="flex flex-col gap-6">
        <div class="aspect-square w-full overflow-hidden rounded-xl">
          <img :src="effectivePost.imageUrl" :alt="effectivePost.caption" class="w-full h-full object-cover" />
        </div>
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold">@{{ effectivePost.userName || (effectivePost.userId?.slice(0,8) + '…') }}</p>
            <p class="text-sm text-gray-500">{{ format(new Date(effectivePost.createdAt), 'dd MMM yyyy HH:mm') }}</p>
          </div>
          <VLikeButton :post-id="effectivePost.id" :current-user-id="currentUserId" />
        </div>
        <p class="text-gray-800">{{ effectivePost.caption }}</p>
        <p class="text-sm text-gray-500">Jumlah Like: {{ effectivePost.likes.length }}</p>
      </div>
    </div>
  </main>
</template>
