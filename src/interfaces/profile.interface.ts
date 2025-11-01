export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  birthdate: Date;
  hobbies: string[];
  gender: string;
  location: string;
  bio: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  interests: string[];
  isActive: boolean;
}

export interface UserProfileRequest {
    id?: string;
    name: string;
    nickname: string;
    birthdate: string;
    hobbies: string [];
    gender: string;
    location: string;
    bio: string;
    email: string;
    phoneNumber: string;
    interests: string [];
    username?: string;
    password?: string;
}

export interface CurrentUser {
    id: string;
    name: string;
    username: string;
    email: string;
    roleName: string;
    nickname: string
}
export interface UserProfileOptions {
  id: string;
  name?: string;
  gender: string;
}