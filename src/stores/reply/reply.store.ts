import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { replyService } from '@/services/reply.service';
import type {
  Reply,
  CreateReplyRequest,
  UpdateReplyRequest,
} from '@/interfaces/reply.interface';
 
export const useReplyStore = defineStore('reply', () => {
  const replies = ref<Reply[]>([]);
  const currentReply = ref<Reply | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
 
  const getRepliesByPost = computed(() => (postId: string) => {
    return replies.value.filter(reply => reply.postId === postId);
  });
 
  async function fetchAllReplies() {
    loading.value = true;
    error.value = null;
    try {
      replies.value = await replyService.getAllReplies();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch replies';
      throw err;
    } finally {
      loading.value = false;
    }
  }
 
  async function fetchRepliesByPostId(postId: string) {
    loading.value = true;
    error.value = null;
    try {
      const data = await replyService.getRepliesByPostId(postId);
      // Update replies for this post
      replies.value = replies.value.filter(r => r.postId !== postId);
      replies.value.push(...data);
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch replies';
      throw err;
    } finally {
      loading.value = false;
    }
  }
 
  async function fetchReplyById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      currentReply.value = await replyService.getReplyById(id);
      return currentReply.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch reply';
      throw err;
    } finally {
      loading.value = false;
    }
  }
 
  async function createReply(request: CreateReplyRequest) {
    loading.value = true;
    error.value = null;
    try {
      const newReply = await replyService.createReply(request);
      replies.value.unshift(newReply);
      return newReply;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create reply';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateReply(id: string, request: UpdateReplyRequest) {
    loading.value = true;
    error.value = null;
    try {
      const updatedReply = await replyService.updateReply(id, request);
      const index = replies.value.findIndex(r => r.id === id);
      if (index !== -1) {
        replies.value[index] = updatedReply;
      }
      if (currentReply.value?.id === id) {
        currentReply.value = updatedReply;
      }
      return updatedReply;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update reply';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteReply(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await replyService.deleteReply(id);
      replies.value = replies.value.filter(r => r.id !== id);
      if (currentReply.value?.id === id) {
        currentReply.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete reply';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }
 
  return {
    replies,
    currentReply,
    loading,
    error,
    getRepliesByPost,
    fetchAllReplies,
    fetchRepliesByPostId,
    fetchReplyById,
    createReply,
    updateReply,
    deleteReply,
    clearError
  };
});