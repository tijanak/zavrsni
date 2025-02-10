export interface IPost {
  id: number;
  description: string;
  time_created: Date;
  looking_for: boolean;
  creator: IUser;
  images: IImage[];
}
export interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  posts: IPost[];
}
export interface IImage {
  id: number;
  fileName: string;
  post: IPost;
}
