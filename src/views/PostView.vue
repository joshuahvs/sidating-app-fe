<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePostStore } from '@/stores/post/post.store';
import { useUserProfileStore } from '@/stores/profile/profile.store';
import VPostCard from '@/components/post/VPostCard.vue';
import VPostFilterDropdown from '@/components/post/VPostFilterDropdown.vue';
import VButton from '@/components/common/VButton.vue';
const currentUserId = ref('');

const postStore = usePostStore();
const posts = computed(() => postStore.posts);

const allUsers = computed(() => Array.from(new Set(posts.value.map(p => p.userId))));

const filter = ref<{ user: string; sort: string }>({ user: '', sort: 'desc' });

const filteredPosts = computed(() => {
  let list = [...posts.value];
  if (filter.value.user) {
    list = list.filter(p => p.userId === filter.value.user);
  }
  list.sort((a, b) => {
    return filter.value.sort === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime();
  });
  return list;
});

const handleFilterChange = (payload: { user: string; sort: string }) => {
  filter.value = payload;
};

const handleDeleted = async (_id: string) => {
  // Store already removed it; refetch to be safe
  await postStore.fetchPosts();
};

onMounted(async () => {
  await postStore.fetchPosts();
  const profileStore = useUserProfileStore();
  const profiles = await profileStore.fetchProfiles();
  if (profiles && profiles.length > 0) {
    currentUserId.value = profiles[0].id;
  }
});
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-7xl flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 class="text-pink-600 font-bold text-xl">Semua Post</h1>
        <div class="flex items-center gap-4">
          <VPostFilterDropdown :users="allUsers" @change="handleFilterChange" />
          <RouterLink to="/posts/add"><VButton class="bg-pink-600 hover:bg-pink-800 text-white whitespace-nowrap">Buat Post Baru</VButton></RouterLink>
        </div>
      </div>

      <div v-if="filteredPosts.length === 0" class="text-center py-20 text-gray-500">Belum ada post</div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <VPostCard v-for="p in filteredPosts" :key="p.id" :post="p" :current-user-id="currentUserId" @deleted="handleDeleted" />
      </div>
    </div>
  </main>
</template>
