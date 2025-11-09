<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { usePostStore } from '@/stores/post/post.store';
import { useUserProfileStore } from '@/stores/profile/profile.store';
import { getCurrentUser } from '@/lib/auth';
import VPostForm from '@/components/post/VPostForm.vue';
import type { PostRequest } from '@/interfaces/post.interface';

const router = useRouter();

const postModel = reactive<PostRequest>({
  userId: '',
  imageUrl: '',
  caption: '',
});

const profileStore = useUserProfileStore();
const userOptions = ref<{ id: string; name: string }[]>([]);
const currentUser = getCurrentUser();
const isAdmin = (currentUser?.roleName || '').toLowerCase() === 'admin';

onMounted(async () => {
  if (isAdmin) {
    const profiles = await profileStore.fetchProfiles();
    userOptions.value = (profiles || []).map((p) => ({ id: p.id, name: p.name }));
  } else if (currentUser?.id) {
    // Ensure model carries current user id for backend validation
    postModel.userId = currentUser.id;
  }
});

const postStore = usePostStore();

const addPost = async (body: PostRequest) => {
  try {
    const created = await postStore.createPost(body);
    if (created) {
      toast.success('Post created successfully');
      router.push('/posts');
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || 'Failed to create post';
    toast.error(msg);
  }
};
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Tambah Post</h1>
      <VPostForm :postModel="postModel" :action="addPost" :userOptions="userOptions" />
    </div>
  </main>
</template>
