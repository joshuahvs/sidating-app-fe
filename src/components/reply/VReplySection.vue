<template>
  <div class="reply-section mt-6">
    <h3 class="text-xl font-semibold mb-4">Replies</h3>
 
    <div v-if="isAuthenticated" class="mb-6">
      <form @submit.prevent="handleSubmitReply" class="space-y-3">
        <VTextArea
          id="reply-content"
          v-model="replyContent"
          placeholder="Write a reply..."
          :rows="3"
          :disabled="replyStore.loading"
        />
        <VButton
          type="submit"
          :disabled="!replyContent.trim() || replyStore.loading"
          class="w-full sm:w-auto"
        >
          {{ replyStore.loading ? 'Posting...' : 'Post Reply' }}
        </VButton>
      </form>
 
      <div v-if="replyStore.error" class="mt-2 text-red-600 text-sm">
        {{ replyStore.error }}
      </div>
    </div>
 
    <div v-else class="mb-6 p-4 bg-gray-100 rounded-lg">
      <p class="text-gray-600">Please login to reply to this post.</p>
    </div>
 
    <div class="space-y-4">
      <div v-if="replyStore.loading && replies.length === 0" class="text-center py-8">
        <p class="text-gray-500">Loading replies...</p>
      </div>
 
      <div v-else-if="replies.length === 0" class="text-center py-8">
        <p class="text-gray-500">No replies yet. Be the first to reply!</p>
      </div>
 
      <div
        v-for="reply in replies"
        :key="reply.id"
        class="border-b border-gray-200 pb-4 last:border-b-0"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-sm font-semibold text-gray-600">
                {{ getUserName(reply).charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
 
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-900">
                  {{ getUserName(reply) }}
                </p>
                <p class="text-sm text-gray-500">
                  @{{ getUserUsername(reply) }}
                </p>
              </div>
 
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500">
                  {{ formatDate(reply.createdAt) }}
                </span>
              </div>
            </div>
 
            <p class="mt-2 text-gray-700 whitespace-pre-wrap">{{ reply.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useReplyStore } from '@/stores/reply/reply.store';
import { useAuthStore } from '@/stores/auth/auth.store';
import VTextArea from '@/components/common/VTextArea.vue';
import VButton from '@/components/common/VButton.vue';
import type { Reply } from '@/interfaces/reply.interface';
 
const props = defineProps<{
  postId: string;
}>();
 
const replyStore = useReplyStore();
const authStore = useAuthStore();
 
const replyContent = ref('');
 
const isAuthenticated = computed(() => !!authStore.token);
const currentUserId = computed(() => authStore.user?.id);
 
const replies = computed(() => {
  return replyStore.replies.filter(r => r.postId === props.postId);
});
 
const handleSubmitReply = async () => {
  if (!replyContent.value.trim() || !currentUserId.value) return;
 
  try {
    await replyStore.createReply({
      postId: props.postId,
      userProfileId: currentUserId.value,
      content: replyContent.value.trim()
    });
    replyContent.value = '';
    replyStore.clearError();
  } catch (error) {
    console.error('Failed to create reply:', error);
  }
};
 
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
 
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
 
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };
 
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
 
  return date.toLocaleDateString('en-US', options);
};
 
const getUserName = (reply: Reply) => {
  if (reply.userProfile?.name) {
    return reply.userProfile.name;
  }
 
  if (reply.userProfileId === currentUserId.value && authStore.user?.name) {
    return authStore.user.name;
  }
 
  return 'Unknown User';
};
 
const getUserUsername = (reply: Reply) => {
  if (reply.userProfile?.username) {
    return reply.userProfile.username;
  }
 
  if (reply.userProfileId === currentUserId.value && authStore.user?.username) {
    return authStore.user.username;
  }
 
  return 'unknown';
};
 
onMounted(async () => {
  try {
    await replyStore.fetchRepliesByPostId(props.postId);
  } catch (error) {
    console.error('Failed to fetch replies:', error);
  }
});
</script>
 
<style scoped>
.reply-section {
  max-width: 100%;
}
</style>