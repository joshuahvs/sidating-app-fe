export interface Reply {
  id: string;
  postId: string;
  userProfileId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userProfile?: UserProfileSimple;
  post?: PostSimple;
}
 
export interface UserProfileSimple {
  id: string;
  username: string;
  name: string;
  nickname: string;
  email: string;
  bio?: string;
}
 
export interface PostSimple {
  id: string;
  userProfileId: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}
 
export interface CreateReplyRequest {
  postId: string;
  userProfileId: string;
  content: string;
}

export interface UpdateReplyRequest {
  content: string;
  userProfileId: string;
  role?: string; // User's role (Admin or User)
}

export interface ReplyResponse {
  status: number;
  message: string;
  data: Reply | Reply[];
  timestamp: string;
}