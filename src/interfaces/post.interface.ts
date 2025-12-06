export interface Post {
  id: string;
  userId: string; // UUID of user profile
  userName?: string; // display name of user profile
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: string[];
}

export interface PostRequest {
  userId: string;
  imageUrl: string;
  caption: string;
}