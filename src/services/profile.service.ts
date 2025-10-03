import type { UserProfile, UserProfileRequest } from '@/interfaces/profile.interface';
import { v4 as uuidv4 } from 'uuid';

const profiles: UserProfile[] = [
  {
    name: "Alice Johnson",
    nickname: "alij",
    birthdate: new Date("1996-05-14"),
    hobbies: ["reading", "painting", "cycling"],
    gender: "Female",
    location: "New York, USA",
    bio: "Bookworm and aspiring painter. Always looking for new adventures.",
    email: "alice.johnson@example.com",
    phoneNumber: "+1234567890",
    interests: ["art", "travel", "technology"],
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    name: "Michael Smith",
    nickname: "mikes",
    birthdate: new Date("1992-09-03"),
    hobbies: ["gaming", "hiking", "photography"],
    gender: "Male",
    location: "Los Angeles, USA",
    bio: "Tech enthusiast and outdoor explorer. Love capturing moments.",
    email: "michael.smith@example.com",
    phoneNumber: "+1987654321",
    interests: ["nature", "coding", "fitness"],
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
];

export class ProfileService {
  private static instance: ProfileService;

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  createProfile(profile: UserProfileRequest): UserProfile | null {
    const birthdate = new Date(profile.birthdate);

    const newProfile: UserProfile = {
      ...profile,
      birthdate,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    profiles.push(newProfile);
    return newProfile;
  }

  getAllProfiles(): UserProfile[] {
    return profiles;
  }

  getProfile(id: string): UserProfile | undefined {
    return profiles.find(profile => profile.id === id);
  }

  deleteProfile(id: string): boolean {
    const index = profiles.findIndex(profile => profile.id === id);
    if (index !== -1) {
      profiles.splice(index, 1);
      return true;
    }
    return false;
  }

  updateProfile(id: string, updatedProfile: Partial<UserProfileRequest>): UserProfile | undefined {
    const profile = this.getProfile(id);
    if (profile) {
      Object.assign(profile, updatedProfile);
      profile.updatedAt = new Date();
      return profile;
    }
    return undefined;
  }
}

export const profileService = ProfileService.getInstance();