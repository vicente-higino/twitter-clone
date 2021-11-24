export interface ProfileInfo {
  profile: Profile;
  texts?: IPost[] | null;
}
export interface Profile {
  id: number;
  username: string;
  images?: string[] | null;
  following: boolean;
  followers: number;
  follows: number;
}
export interface IPost {
  images?: (ImagesEntity | null)[] | null;
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  profileId: number;
  profile: Profile1;
  likes?: (LikesEntity | null)[] | null;
}
export interface ImagesEntity {
  url: string;
  type: string;
}
export interface Profile1 {
  images?: string[] | null;
  username: string;
}
export interface LikesEntity {
  profileId: number;
  profile: Profile1;
}
