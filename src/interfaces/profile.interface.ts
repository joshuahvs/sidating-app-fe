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
  name: string;
  nickname: string;
  birthdate: string;
  hobbies: string[];
  gender: string;
  location: string;
  bio: string;
  email: string;
  phoneNumber: string;
  interests: string[];
}

export interface UserProfileOptions {
  id: string;
  name?: string;
  gender: string;
}