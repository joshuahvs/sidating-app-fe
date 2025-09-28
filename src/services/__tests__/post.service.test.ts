import { describe, it, expect, beforeEach } from 'vitest'
import { PostService, postService } from '../post.service'
import type { PostRequest } from '../../interfaces/post.interface'
 
describe('PostService', () => {
  let service: PostService
 
  beforeEach(() => {
    service = PostService.getInstance()
    // Clear any existing posts for clean tests (including dummy data)
    const posts = service.getAllPosts()
    posts.splice(0, posts.length) // Clear the array completely
  })
 
  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = PostService.getInstance()
      const instance2 = PostService.getInstance()
      expect(instance1).toBe(instance2)
    })
 
    it('should return the same instance as exported postService', () => {
      expect(service).toBe(postService)
    })
  })
 
  describe('createPost', () => {
    it('should create a new post with valid data', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'This is a test post'
      }
 
      const result = service.createPost(postRequest)
 
      expect(result).toBeDefined()
      expect(result.userId).toBe(postRequest.userId)
      expect(result.imageUrl).toBe(postRequest.imageUrl)
      expect(result.caption).toBe(postRequest.caption)
      expect(result.id).toBe('test-uuid-123')
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.likes).toEqual([])
    })
 
    it('should create multiple posts with different IDs', () => {
      const post1: PostRequest = {
        userId: 'user-1',
        imageUrl: 'https://example.com/image1.jpg',
        caption: 'First post'
      }
 
      const post2: PostRequest = {
        userId: 'user-2',
        imageUrl: 'https://example.com/image2.jpg',
        caption: 'Second post'
      }
 
      const result1 = service.createPost(post1)
      const result2 = service.createPost(post2)
 
      expect(result1.id).toBe('test-uuid-123')
      expect(result2.id).toBe('test-uuid-123') // Both will have same ID due to mock
      expect(result1.caption).toBe('First post')
      expect(result2.caption).toBe('Second post')
    })
 
    it('should initialize posts with empty likes array', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post'
      }
 
      const result = service.createPost(postRequest)
 
      expect(result.likes).toEqual([])
      expect(Array.isArray(result.likes)).toBe(true)
    })
  })
 
  describe('getAllPosts', () => {
    it('should return empty array when no posts exist', () => {
      const posts = service.getAllPosts()
      expect(posts).toEqual([])
      expect(Array.isArray(posts)).toBe(true)
    })
 
    it('should return all created posts', () => {
      const post1: PostRequest = {
        userId: 'user-1',
        imageUrl: 'https://example.com/image1.jpg',
        caption: 'Post 1'
      }
 
      const post2: PostRequest = {
        userId: 'user-2',
        imageUrl: 'https://example.com/image2.jpg',
        caption: 'Post 2'
      }
 
      service.createPost(post1)
      service.createPost(post2)
 
      const posts = service.getAllPosts()
      expect(posts).toHaveLength(2)
      expect(posts[0].caption).toBe('Post 1')
      expect(posts[1].caption).toBe('Post 2')
    })
  })
 
  describe('getPost', () => {
    it('should return post by id', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post'
      }
 
      const created = service.createPost(postRequest)
      const found = service.getPost(created.id)
 
      expect(found).toBe(created)
      expect(found?.caption).toBe('Test post')
    })
 
    it('should return undefined for non-existent id', () => {
      const found = service.getPost('non-existent-id')
      expect(found).toBeUndefined()
    })
  })
 
  describe('deletePost', () => {
    it('should delete existing post and return true', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Post to delete'
      }
 
      const created = service.createPost(postRequest)
      const deleted = service.deletePost(created.id)
 
      expect(deleted).toBe(true)
      expect(service.getPost(created.id)).toBeUndefined()
      expect(service.getAllPosts()).toHaveLength(0)
    })
 
    it('should return false for non-existent post', () => {
      const deleted = service.deletePost('non-existent-id')
      expect(deleted).toBe(false)
    })
 
    it('should only delete the specified post', () => {
      const post1: PostRequest = {
        userId: 'user-1',
        imageUrl: 'https://example.com/image1.jpg',
        caption: 'Post 1'
      }
 
      const post2: PostRequest = {
        userId: 'user-2',
        imageUrl: 'https://example.com/image2.jpg',
        caption: 'Post 2'
      }
 
      const created1 = service.createPost(post1)
      const created2 = service.createPost(post2)
 
      const deleted = service.deletePost(created1.id)
 
      expect(deleted).toBe(true)
      expect(service.getAllPosts()).toHaveLength(1)
      expect(service.getPost(created2.id)).toBeDefined()
    })
  })
 
  describe('updatePost', () => {
    it('should update existing post', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/original.jpg',
        caption: 'Original caption'
      }
 
      const created = service.createPost(postRequest)
      
      const updates = {
        caption: 'Updated caption',
        imageUrl: 'https://example.com/updated.jpg'
      }
 
      const updated = service.updatePost(created.id, updates)
 
      expect(updated).toBeDefined()
      expect(updated?.caption).toBe('Updated caption')
      expect(updated?.imageUrl).toBe('https://example.com/updated.jpg')
      expect(updated?.userId).toBe('user-123') // unchanged
    })
 
    it('should return undefined for non-existent post', () => {
      const updated = service.updatePost('non-existent-id', { caption: 'New caption' })
      expect(updated).toBeUndefined()
    })
 
    it('should allow partial updates', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Original caption'
      }
 
      const created = service.createPost(postRequest)
      const updated = service.updatePost(created.id, { caption: 'Only caption updated' })
 
      expect(updated?.caption).toBe('Only caption updated')
      expect(updated?.imageUrl).toBe('https://example.com/image.jpg') // unchanged
      expect(updated?.userId).toBe('user-123') // unchanged
    })
  })
 
  describe('likePost', () => {
    it('should add like to post when user has not liked before', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post'
      }
 
      const created = service.createPost(postRequest)
      const liked = service.likePost(created.id, 'liker-user-1')
 
      expect(liked).toBe(true)
      expect(created.likes).toContain('liker-user-1')
      expect(created.likes).toHaveLength(1)
    })
 
    it('should not add duplicate like from same user', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post'
      }
 
      const created = service.createPost(postRequest)
      
      // First like
      const liked1 = service.likePost(created.id, 'liker-user-1')
      expect(liked1).toBe(true)
      
      // Second like from same user
      const liked2 = service.likePost(created.id, 'liker-user-1')
      expect(liked2).toBe(false)
      
      expect(created.likes).toHaveLength(1)
      expect(created.likes).toEqual(['liker-user-1'])
    })
 
    it('should allow different users to like the same post', () => {
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post'
      }
 
      const created = service.createPost(postRequest)
      
      const liked1 = service.likePost(created.id, 'liker-user-1')
      const liked2 = service.likePost(created.id, 'liker-user-2')
      const liked3 = service.likePost(created.id, 'liker-user-3')
 
      expect(liked1).toBe(true)
      expect(liked2).toBe(true)
      expect(liked3).toBe(true)
      
      expect(created.likes).toHaveLength(3)
      expect(created.likes).toEqual(['liker-user-1', 'liker-user-2', 'liker-user-3'])
    })
 
    it('should return false for non-existent post', () => {
      const liked = service.likePost('non-existent-id', 'user-123')
      expect(liked).toBe(false)
    })
  })
 
  describe('filter', () => {
    beforeEach(() => {
      // Create test posts with different users and dates
      const post1: PostRequest = {
        userId: 'user1',
        imageUrl: 'https://example.com/image1.jpg',
        caption: 'Post 1'
      }
      const post2: PostRequest = {
        userId: 'user2',
        imageUrl: 'https://example.com/image2.jpg',
        caption: 'Post 2'
      }
      const post3: PostRequest = {
        userId: 'user1',
        imageUrl: 'https://example.com/image3.jpg',
        caption: 'Post 3'
      }
 
      service.createPost(post1)
      service.createPost(post2)
      service.createPost(post3)
    })
 
    it('should filter posts by user', () => {
      const user1Posts = service.filter('user1', 'desc')
      expect(user1Posts).toHaveLength(2)
      expect(user1Posts.every(post => post.userId === 'user1')).toBe(true)
 
      const user2Posts = service.filter('user2', 'desc')
      expect(user2Posts).toHaveLength(1)
      expect(user2Posts[0].userId).toBe('user2')
    })
 
    it('should return empty array for non-existent user', () => {
      const nonExistentUserPosts = service.filter('non-existent-user', 'desc')
      expect(nonExistentUserPosts).toEqual([])
    })
 
    it('should sort posts in descending order (newest first)', () => {
      const user1Posts = service.filter('user1', 'desc')
      expect(user1Posts).toHaveLength(2)
      // Posts should be sorted by createdAt descending (newest first)
      expect(user1Posts[0].createdAt.getTime()).toBeGreaterThanOrEqual(user1Posts[1].createdAt.getTime())
    })
 
    it('should sort posts in ascending order (oldest first)', () => {
      const user1Posts = service.filter('user1', 'asc')
      expect(user1Posts).toHaveLength(2)
      // Posts should be sorted by createdAt ascending (oldest first)
      expect(user1Posts[0].createdAt.getTime()).toBeLessThanOrEqual(user1Posts[1].createdAt.getTime())
    })
  })
 
  describe('sortPosts', () => {
    beforeEach(() => {
      // Create test posts with different dates
      const post1: PostRequest = {
        userId: 'user1',
        imageUrl: 'https://example.com/image1.jpg',
        caption: 'Post 1'
      }
      const post2: PostRequest = {
        userId: 'user2',
        imageUrl: 'https://example.com/image2.jpg',
        caption: 'Post 2'
      }
      const post3: PostRequest = {
        userId: 'user3',
        imageUrl: 'https://example.com/image3.jpg',
        caption: 'Post 3'
      }
 
      service.createPost(post1)
      service.createPost(post2)
      service.createPost(post3)
    })
 
    it('should return all posts sorted in descending order (newest first)', () => {
      const sortedPosts = service.sortPosts('desc')
      expect(sortedPosts).toHaveLength(3)
      
      // Verify all posts are included
      const userIds = sortedPosts.map(post => post.userId)
      expect(userIds).toContain('user1')
      expect(userIds).toContain('user2')
      expect(userIds).toContain('user3')
      
      // Verify sorting order (newest first)
      for (let i = 0; i < sortedPosts.length - 1; i++) {
        expect(sortedPosts[i].createdAt.getTime()).toBeGreaterThanOrEqual(sortedPosts[i + 1].createdAt.getTime())
      }
    })
 
    it('should return all posts sorted in ascending order (oldest first)', () => {
      const sortedPosts = service.sortPosts('asc')
      expect(sortedPosts).toHaveLength(3)
      
      // Verify all posts are included
      const userIds = sortedPosts.map(post => post.userId)
      expect(userIds).toContain('user1')
      expect(userIds).toContain('user2')
      expect(userIds).toContain('user3')
      
      // Verify sorting order (oldest first)
      for (let i = 0; i < sortedPosts.length - 1; i++) {
        expect(sortedPosts[i].createdAt.getTime()).toBeLessThanOrEqual(sortedPosts[i + 1].createdAt.getTime())
      }
    })
 
    it('should not modify the original posts array', () => {
      const originalPosts = service.getAllPosts()
      const sortedPosts = service.sortPosts('desc')
      
      expect(originalPosts).toHaveLength(3)
      expect(sortedPosts).toHaveLength(3)
      
      // Original array should remain unchanged
      expect(originalPosts[0].caption).toBe('Post 1')
      expect(originalPosts[1].caption).toBe('Post 2')
      expect(originalPosts[2].caption).toBe('Post 3')
    })
 
    it('should return empty array when no posts exist', () => {
      // Clear all posts
      const posts = service.getAllPosts()
      posts.splice(0, posts.length)
      
      const sortedPosts = service.sortPosts('desc')
      expect(sortedPosts).toEqual([])
    })
  })
 
  describe('integration tests', () => {
    it('should handle complete post lifecycle', () => {
      // Create post
      const postRequest: PostRequest = {
        userId: 'user-123',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Lifecycle test post'
      }
 
      const created = service.createPost(postRequest)
      expect(service.getAllPosts()).toHaveLength(1)
 
      // Update post
      const updated = service.updatePost(created.id, { caption: 'Updated caption' })
      expect(updated?.caption).toBe('Updated caption')
 
      // Like post
      service.likePost(created.id, 'user-1')
      service.likePost(created.id, 'user-2')
      expect(created.likes).toHaveLength(2)
 
      // Delete post
      const deleted = service.deletePost(created.id)
      expect(deleted).toBe(true)
      expect(service.getAllPosts()).toHaveLength(0)
    })
 
    it('should handle filtering and sorting workflow', () => {
      // Create multiple posts with different users
      const post1: PostRequest = {
        userId: 'user1',
        imageUrl: 'https://example.com/image1.jpg',
        caption: 'First post'
      }
      const post2: PostRequest = {
        userId: 'user2',
        imageUrl: 'https://example.com/image2.jpg',
        caption: 'Second post'
      }
      const post3: PostRequest = {
        userId: 'user1',
        imageUrl: 'https://example.com/image3.jpg',
        caption: 'Third post'
      }
 
      service.createPost(post1)
      service.createPost(post2)
      service.createPost(post3)
 
      // Test filtering by user
      const user1Posts = service.filter('user1', 'desc')
      expect(user1Posts).toHaveLength(2)
      expect(user1Posts.every(post => post.userId === 'user1')).toBe(true)
 
      // Test sorting all posts
      const allPostsDesc = service.sortPosts('desc')
      expect(allPostsDesc).toHaveLength(3)
      
      const allPostsAsc = service.sortPosts('asc')
      expect(allPostsAsc).toHaveLength(3)
      
      // Verify sorting is working by checking timestamps
      // In descending order, first post should have later or equal timestamp
      expect(allPostsDesc[0].createdAt.getTime()).toBeGreaterThanOrEqual(allPostsDesc[1].createdAt.getTime())
      expect(allPostsDesc[1].createdAt.getTime()).toBeGreaterThanOrEqual(allPostsDesc[2].createdAt.getTime())
      
      // In ascending order, first post should have earlier or equal timestamp
      expect(allPostsAsc[0].createdAt.getTime()).toBeLessThanOrEqual(allPostsAsc[1].createdAt.getTime())
      expect(allPostsAsc[1].createdAt.getTime()).toBeLessThanOrEqual(allPostsAsc[2].createdAt.getTime())
      
      // Verify both arrays contain the same posts (just different order)
      const descCaptions = allPostsDesc.map(post => post.caption).sort()
      const ascCaptions = allPostsAsc.map(post => post.caption).sort()
      expect(descCaptions).toEqual(ascCaptions)
    })
  })
})