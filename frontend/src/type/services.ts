import { Models } from "appwrite";

export type Service<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: {
        message: string;
      };
    };

export interface Post 
{
  slug: string;
  title: string;
  content: string;
  featuredImage: string;
  status: string;
  userId: string;
}

export type PostDocument = Post & Models.Document;

