import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../post.store'
import { http } from '@/lib/http'
import { getCurrentUser } from '@/lib/auth'
import { toast } from 'vue-sonner'

vi.mock('@/lib/http')
vi.mock('@/lib/auth')
vi.mock('vue-sonner')

describe('usePostStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.mocked(getCurrentUser).mockReturnValue({ id: 'user-123', username: 'testuser' })
  })

  describe('fetchPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockPosts = [
        {
          id: '1',
          userProfileId: 'user-1',
          userProfileName: 'User 1',
          imageUrl: 'image1.jpg',
          caption: 'Caption 1',
          createdAt: '2024-01-01T10:00:00',
          likes: ['user-2'],
          likeCount: 1,
          timeAgo: '1 day ago'
        }
      ]

      vi.mocked(http.get).mockResolvedValue({
        data: { data: mockPosts },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.fetchPosts()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
      expect(store.posts).toHaveLength(1)
      expect(store.loading).toBe(false)
      expect(toast.success).toHaveBeenCalledWith('Data post berhasil dimuat')
    })

    it('should show warning when no posts found', async () => {
      vi.mocked(http.get).mockResolvedValue({
        data: { data: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.fetchPosts()

      expect(result).toHaveLength(0)
      expect(toast.warning).toHaveBeenCalledWith('Data post kosong')
    })

    it('should handle fetch error', async () => {
      vi.mocked(http.get).mockRejectedValue(new Error('Network error'))

      const store = usePostStore()
      const result = await store.fetchPosts()

      expect(result).toHaveLength(0)
      expect(store.error).toBe('Network error')
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat post: Network error')
    })

    it('should fetch posts with params', async () => {
      vi.mocked(http.get).mockResolvedValue({
        data: { data: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      await store.fetchPosts({ userId: 'user-1', date: '2024-01-01' })

      expect(http.get).toHaveBeenCalledWith(expect.any(String), {
        params: { userId: 'user-1', date: '2024-01-01' }
      })
    })
  })

  describe('getPostById', () => {
    it('should get post by id successfully', async () => {
      const mockPost = {
        id: '1',
        userProfileId: 'user-1',
        userProfileName: 'User 1',
        imageUrl: 'image1.jpg',
        caption: 'Caption 1',
        createdAt: '2024-01-01T10:00:00',
        likes: [],
        likeCount: 0,
        timeAgo: '1 day ago'
      }

      vi.mocked(http.get).mockResolvedValue({
        data: { data: mockPost },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.getPostById('1')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('1')
    })

    it('should handle get post error', async () => {
      vi.mocked(http.get).mockRejectedValue(new Error('Not found'))

      const store = usePostStore()
      const result = await store.getPostById('999')

      expect(result).toBeNull()
      expect(store.error).toBe('Not found')
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat detail post: Not found')
    })
  })

  describe('createPost', () => {
    it('should create post successfully', async () => {
      const mockPost = {
        id: 'new-1',
        userProfileId: 'user-123',
        userProfileName: 'Test User',
        imageUrl: 'image.jpg',
        caption: 'New post',
        createdAt: '2024-01-01T10:00:00',
        likes: [],
        likeCount: 0,
        timeAgo: 'just now'
      }

      vi.mocked(http.post).mockResolvedValue({
        data: { data: mockPost },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.createPost({
        imageUrl: 'image.jpg',
        caption: 'New post'
      })

      expect(result).not.toBeNull()
      expect(result?.id).toBe('new-1')
      expect(store.posts).toHaveLength(1)
      expect(toast.success).toHaveBeenCalledWith('Post berhasil dibuat')
    })

    it('should handle create post with explicit userId', async () => {
      const mockPost = {
        id: 'new-1',
        userProfileId: 'custom-user',
        userProfileName: 'Custom User',
        imageUrl: 'image.jpg',
        caption: 'New post',
        createdAt: '2024-01-01T10:00:00',
        likes: [],
        likeCount: 0,
        timeAgo: 'just now'
      }

      vi.mocked(http.post).mockResolvedValue({
        data: { data: mockPost },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.createPost({
        userId: 'custom-user',
        imageUrl: 'image.jpg',
        caption: 'New post'
      })

      expect(result).not.toBeNull()
      expect(http.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ userProfileId: 'custom-user' })
      )
    })

    it('should handle create post error', async () => {
      vi.mocked(http.post).mockRejectedValue({
        response: { data: { message: 'Validation error' } }
      })

      const store = usePostStore()
      const result = await store.createPost({
        imageUrl: 'image.jpg',
        caption: 'New post'
      })

      expect(result).toBeNull()
      expect(store.error).toBe('Validation error')
      expect(toast.error).toHaveBeenCalledWith('Gagal membuat post: Validation error')
    })

    it('should show warning when status is not 201', async () => {
      vi.mocked(http.post).mockResolvedValue({
        data: { data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.createPost({
        imageUrl: 'image.jpg',
        caption: 'New post'
      })

      expect(result).toBeNull()
      expect(toast.warning).toHaveBeenCalledWith('Gagal membuat post')
    })
  })

  describe('updatePost', () => {
    it('should update post successfully', async () => {
      const existingPost = {
        id: '1',
        userId: 'user-1',
        imageUrl: 'old.jpg',
        caption: 'Old caption',
        createdAt: new Date(),
        likes: []
      }

      const updatedPost = {
        id: '1',
        userProfileId: 'user-123',
        userProfileName: 'User',
        imageUrl: 'new.jpg',
        caption: 'New caption',
        createdAt: '2024-01-01T10:00:00',
        likes: [],
        likeCount: 0,
        timeAgo: '1 day ago'
      }

      const store = usePostStore()
      store.posts = [existingPost]

      vi.mocked(http.put).mockResolvedValue({
        data: { data: updatedPost },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const result = await store.updatePost('1', {
        imageUrl: 'new.jpg',
        caption: 'New caption'
      })

      expect(result).not.toBeNull()
      expect(result?.caption).toBe('New caption')
      expect(store.posts[0].caption).toBe('New caption')
      expect(toast.success).toHaveBeenCalledWith('Post berhasil diperbarui')
    })

    it('should handle update post error', async () => {
      vi.mocked(http.put).mockRejectedValue(new Error('Update failed'))

      const store = usePostStore()
      const result = await store.updatePost('1', { caption: 'New caption' })

      expect(result).toBeNull()
      expect(toast.error).toHaveBeenCalledWith('Gagal memperbarui post: Update failed')
    })

    it('should show warning when status is not 200', async () => {
      vi.mocked(http.put).mockResolvedValue({
        data: { data: null },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.updatePost('1', { caption: 'New caption' })

      expect(result).toBeNull()
      expect(toast.warning).toHaveBeenCalledWith('Gagal memperbarui post')
    })
  })

  describe('deletePost', () => {
    it('should delete post successfully', async () => {
      const store = usePostStore()
      store.posts = [
        { id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] },
        { id: '2', userId: 'user-2', imageUrl: 'img2.jpg', caption: 'Post 2', createdAt: new Date(), likes: [] }
      ]

      vi.mocked(http.request).mockResolvedValue({
        data: { data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const result = await store.deletePost('1')

      expect(result).toBe(true)
      expect(store.posts).toHaveLength(1)
      expect(store.posts[0].id).toBe('2')
      expect(toast.success).toHaveBeenCalledWith('Post berhasil dihapus')
    })

    it('should handle 204 status as success', async () => {
      const store = usePostStore()
      store.posts = [{ id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] }]

      vi.mocked(http.request).mockResolvedValue({
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {} as any
      })

      const result = await store.deletePost('1')

      expect(result).toBe(true)
      expect(store.posts).toHaveLength(0)
    })

    it('should revert optimistic update on 404', async () => {
      const store = usePostStore()
      const originalPosts = [{ id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] }]
      store.posts = [...originalPosts]

      vi.mocked(http.request).mockResolvedValue({
        data: { message: 'Post not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {} as any
      })

      const result = await store.deletePost('1')

      expect(result).toBe(false)
      expect(store.posts).toHaveLength(1)
      expect(toast.warning).toHaveBeenCalledWith('Post tidak ditemukan')
    })

    it('should revert optimistic update on error', async () => {
      const store = usePostStore()
      const originalPosts = [{ id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] }]
      store.posts = [...originalPosts]

      vi.mocked(http.request).mockRejectedValue({
        response: { data: { message: 'Server error' } }
      })

      const result = await store.deletePost('1')

      expect(result).toBe(false)
      expect(store.posts).toHaveLength(1)
      expect(toast.error).toHaveBeenCalledWith('Gagal menghapus post: Server error')
    })

    it('should revert optimistic update on non-2xx status', async () => {
      const store = usePostStore()
      const originalPosts = [{ id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] }]
      store.posts = [...originalPosts]

      vi.mocked(http.request).mockResolvedValue({
        data: { message: 'Forbidden' },
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config: {} as any
      })

      const result = await store.deletePost('1')

      expect(result).toBe(false)
      expect(store.posts).toHaveLength(1)
      expect(toast.error).toHaveBeenCalledWith('Forbidden')
    })
  })

  describe('likePost', () => {
    it('should like post successfully', async () => {
      const store = usePostStore()
      store.posts = [{ id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] }]

      const updatedPost = {
        id: '1',
        userProfileId: 'user-1',
        userProfileName: 'User',
        imageUrl: 'img1.jpg',
        caption: 'Post 1',
        createdAt: '2024-01-01T10:00:00',
        likes: ['user-123'],
        likeCount: 1,
        timeAgo: '1 day ago'
      }

      vi.mocked(http.post).mockResolvedValue({
        data: { data: updatedPost },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      const result = await store.likePost('1', 'user-123')

      expect(result).not.toBeNull()
      expect(result?.likes).toContain('user-123')
      expect(store.posts[0].likes).toContain('user-123')
    })

    it('should use current user when userId not provided', async () => {
      const store = usePostStore()
      store.posts = [{ id: '1', userId: 'user-1', imageUrl: 'img1.jpg', caption: 'Post 1', createdAt: new Date(), likes: [] }]

      const updatedPost = {
        id: '1',
        userProfileId: 'user-1',
        userProfileName: 'User',
        imageUrl: 'img1.jpg',
        caption: 'Post 1',
        createdAt: '2024-01-01T10:00:00',
        likes: ['user-123'],
        likeCount: 1,
        timeAgo: '1 day ago'
      }

      vi.mocked(http.post).mockResolvedValue({
        data: { data: updatedPost },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      })

      await store.likePost('1', '')

      expect(http.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ userId: 'user-123' })
      )
    })

    it('should handle like post error', async () => {
      vi.mocked(http.post).mockRejectedValue(new Error('Like failed'))

      const store = usePostStore()
      const result = await store.likePost('1', 'user-123')

      expect(result).toBeNull()
      expect(toast.error).toHaveBeenCalledWith('Gagal like/unlike post: Like failed')
    })

    it('should show warning when status is not 200', async () => {
      vi.mocked(http.post).mockResolvedValue({
        data: { data: null },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      })

      const store = usePostStore()
      const result = await store.likePost('1', 'user-123')

      expect(result).toBeNull()
      expect(toast.warning).toHaveBeenCalledWith('Gagal mengubah status like')
    })
  })
})
