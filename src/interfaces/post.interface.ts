export interface Post {
  id: string;
  userId: string;
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