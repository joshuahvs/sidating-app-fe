import type { Post, PostRequest } from '@/interfaces/post.interface';
import { v4 as uuidv4 } from 'uuid';

const posts: Post[] = [
  {
    id: uuidv4(),
    userId: "user1",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    caption: "Pagi, APAP. Ayo naik gunung. #hiking #sunset #nature",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    likes: ["user2", "user3", "user4"],
  },
  {
    id: uuidv4(),
    userId: "user2",
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop",
    caption: "Ngopi sambil nugas pagi",
    createdAt: new Date("2024-01-14T09:15:00Z"),
    likes: ["user1", "user5"],
  },
  {
    id: uuidv4(),
    userId: "user3",
    imageUrl: "https://images.unsplash.com/photo-1524412450875-b295a363748c?w=500&h=500&fit=crop",
    caption: "Delicious homemade pasta for dinner tonight! Cooking is such a therapeutic activity. Recipe in my bio!",
    createdAt: new Date("2024-01-13T19:45:00Z"),
    likes: ["user1", "user2", "user4", "user6"],
  },
];

export class PostService {
  private static instance: PostService;

  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  createPost(post: PostRequest): Post {
    const newPost: Post = {
      ...post,
      id: uuidv4(),
      createdAt: new Date(),
      likes: [],
    };
    posts.push(newPost);
    return newPost;
  }

  getAllPosts(): Post[] {
    return posts;
  }

  getPost(id: string): Post | undefined {
    return posts.find(post => post.id === id);
  }

  deletePost(id: string): boolean {
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      return true;
    }
    return false;
  }

  updatePost(id: string, updatedPost: Partial<PostRequest>): Post | undefined {
    const post = this.getPost(id);
    if (post) {
      Object.assign(post, updatedPost);
      return post;
    }
    return undefined;
  }

  likePost(id: string, userId: string): boolean {
    const post = this.getPost(id);
    if (post && !post.likes.includes(userId)) {
      post.likes.push(userId);
      return true;
    }
    return false;
  }

  filter(user: string, sort: string): Post[] {
    return posts.filter(post => post.userId === user).sort((a, b) => {
      return sort === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()
    })
  }

  sortPosts(sort: string): Post[] {
    return [...posts].sort((a, b) => {
      return sort === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()
    })
  }
}

export const postService = PostService.getInstance();