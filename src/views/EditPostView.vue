<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { usePostStore } from '@/stores/post/post.store';
import { useUserProfileStore } from '@/stores/profile/profile.store';
import VPostForm from '@/components/post/VPostForm.vue';
import type { PostRequest } from '@/interfaces/post.interface';

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;
const postStore = usePostStore();
const loading = ref(true);
const postModel = reactive<PostRequest>({ userId: '', imageUrl: '', caption: '' });

const profileStore = useUserProfileStore();
const userOptions = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  // Load profiles for select options
  const profiles = await profileStore.fetchProfiles();
  userOptions.value = (profiles || []).map((p) => ({ id: p.id, name: p.name }));

  // Load existing post data
  const existing = await postStore.getPostById(id);
  if (!existing) {
    router.replace('/posts');
    return;
  }
  postModel.userId = existing.userId || '';
  postModel.imageUrl = existing.imageUrl || '';
  postModel.caption = existing.caption || '';
  loading.value = false;
});

const updatePost = async (body: PostRequest) => {
  try {
  const updated = await postStore.updatePost(id, body);
    if (updated) {
      toast.success('Post updated successfully');
      router.push('/posts');
    } else {
      toast.error('Failed to update post');
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Failed to update post';
    toast.error(msg);
  }
};
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Edit Post</h1>
      <div v-if="loading" class="text-gray-500">Loading…</div>
      <VPostForm v-else :postModel="postModel" :action="updatePost" :userOptions="userOptions" />
    </div>
  </main>
</template>
