export interface Post {
  id: number;
  title: string;
  body: string;
  looking_for: boolean;
  user: IUser;
  images: IImage[];
}
export interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  posts: Post[];
}
export interface IImage {
  id: number;
  fileName: string;
  post: Post;
}
