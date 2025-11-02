import { defineStore } from 'pinia';
import axios from 'axios';
import { http } from '@/lib/http';
import { getCurrentUser } from '@/lib/auth';
import { toast } from 'vue-sonner';
import type { Post, PostRequest } from '@/interfaces/post.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';

const basePostUrl = `${import.meta.env.VITE_API_URL}/posts`;

// Matches backend PostResponseDTO
type PostResponseDTO = {
  id: string;
  userProfileId: string | null;
  userProfileName: string | null;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likes: string[];
  likeCount: number;
  timeAgo: string;
};

function safeParseDate(value: string): Date {
  const direct = new Date(value);
  if (!isNaN(direct.getTime())) return direct;
  // Trim fractional seconds to 3 digits
  const trimmed = value.replace(/\.(\d{3})\d+$/, '.$1');
  const d2 = new Date(trimmed);
  if (!isNaN(d2.getTime())) return d2;
  // Drop fractional seconds entirely
  const noFrac = value.split('.')[0];
  const d3 = new Date(noFrac);
  return isNaN(d3.getTime()) ? new Date() : d3;
}

function mapDto(dto: PostResponseDTO): Post {
  return {
    id: dto.id,
    userId: dto.userProfileId || '',
    userName: dto.userProfileName || undefined,
    imageUrl: dto.imageUrl,
    caption: dto.caption,
    createdAt: safeParseDate(dto.createdAt),
    likes: dto.likes ?? [],
  };
}

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPosts(params?: { userId?: string; date?: string }) {
      this.loading = true;
      this.error = null;
      try {
  const { data } = await http.get<CommonResponseInterface<PostResponseDTO[]>>(basePostUrl, { params });
        this.posts = (data.data || []).map(mapDto);
        if (this.posts.length === 0) toast.warning('Data post kosong'); else toast.success('Data post berhasil dimuat');
        return this.posts;
      } catch (e: any) {
        this.error = e?.message || 'Unknown error';
        toast.error(`Gagal memuat post: ${this.error}`);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async getPostById(id: string) {
      this.loading = true;
      this.error = null;
      try {
  const { data } = await http.get<CommonResponseInterface<PostResponseDTO>>(`${basePostUrl}/${id}`);
        return data.data ? mapDto(data.data) : null;
      } catch (e: any) {
        this.error = e?.message || 'Unknown error';
        toast.error(`Gagal memuat detail post: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createPost(body: PostRequest) {
      this.loading = true;
      this.error = null;
      try {
  const current = getCurrentUser();
  const userId = body.userId || current?.id || '';
  const payload = { userProfileId: userId, imageUrl: body.imageUrl, caption: body.caption };
  const { data, status } = await http.post<CommonResponseInterface<PostResponseDTO>>(`${basePostUrl}/create`, payload);
        if (status === 201) {
          const created = mapDto(data.data);
          this.posts.push(created);
          toast.success('Post berhasil dibuat');
          return created;
        }
        toast.warning('Gagal membuat post');
        return null;
      } catch (e: any) {
        this.error = e?.response?.data?.message || e?.message || 'Unknown error';
        toast.error(`Gagal membuat post: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updatePost(id: string, body: Partial<PostRequest>) {
      this.loading = true;
      this.error = null;
      try {
  const current = getCurrentUser();
  const userId = body.userId || current?.id || '';
  const payload = { id, userProfileId: userId, imageUrl: body.imageUrl, caption: body.caption };
  const { data, status } = await http.put<CommonResponseInterface<PostResponseDTO>>(`${basePostUrl}/update`, payload);
        if (status === 200) {
          const updated = mapDto(data.data);
          this.posts = this.posts.map(p => (p.id === id ? updated : p));
          toast.success('Post berhasil diperbarui');
          return updated;
        }
        toast.warning('Gagal memperbarui post');
        return null;
      } catch (e: any) {
        this.error = e?.response?.data?.message || e?.message || 'Unknown error';
        toast.error(`Gagal memperbarui post: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(id: string) {
      // Optimistic update: remove locally first for instant UI feedback
      this.error = null;
      const previous = [...this.posts];
      this.posts = this.posts.filter(p => p.id !== id);

      try {
        const response = await http.request<CommonResponseInterface<PostResponseDTO>>({
          method: 'DELETE',
          url: `${basePostUrl}/delete`,
          headers: { 'Content-Type': 'application/json' },
          data: { id },
          validateStatus: () => true,
        });

        // Treat any 2xx as success (200/204, etc.)
        if (response.status >= 200 && response.status < 300) {
          toast.success('Post berhasil dihapus');
          return true;
        }

        // Non-2xx -> revert optimistic update
        this.posts = previous;
        if (response.status === 404) {
          toast.warning('Post tidak ditemukan');
        } else {
          const msg = (response.data as any)?.message || 'Gagal menghapus post';
          toast.error(msg);
        }
        return false;
      } catch (e: any) {
        // Network/error -> revert optimistic update
        this.posts = previous;
        this.error = e?.response?.data?.message || e?.message || 'Unknown error';
        toast.error(`Gagal menghapus post: ${this.error}`);
        return false;
      }
    },

    async likePost(postId: string, userId: string) {
      this.loading = true;
      this.error = null;
      try {
  const current = getCurrentUser();
  const actingUserId = userId || current?.id || '';
  const payload = { postId, userId: actingUserId };
  const { data, status } = await http.post<CommonResponseInterface<PostResponseDTO>>(`${basePostUrl}/like`, payload);
        if (status === 200) {
          const updated = mapDto(data.data);
          this.posts = this.posts.map(p => (p.id === postId ? updated : p));
          return updated;
        }
        toast.warning('Gagal mengubah status like');
        return null;
      } catch (e: any) {
        this.error = e?.response?.data?.message || e?.message || 'Unknown error';
        toast.error(`Gagal like/unlike post: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
