export interface IPost {
  id: number;
  title: string;
  body: string;
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
