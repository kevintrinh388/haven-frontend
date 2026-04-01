import type { User } from "./User";

export interface Profile {
  id: number;
  name: string;
  bio: string;
  age: number;
  gender: string;
  location: string;
  interests: string;
  user: User;
  photoUrl?: string;
}
