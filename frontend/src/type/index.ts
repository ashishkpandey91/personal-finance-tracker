import { ReactNode } from "react";
import { Control } from "react-hook-form";
export interface RTEProps {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    label?: string;
    defaultValue?: string;
  }

  export interface  postCard {
    $id: string;
    title: string;
    featuredImage? : string;
    content : string;
  }

  export interface ProtectedProps {
    children: ReactNode,
    authentication?: boolean
}

export interface PostFormProps {
  post?: {
    title: string;
    $id: string;
    content?: string;
    featuredImage?: string;
    status?: string;
  } | null;
}

export interface FormData {
  title: string;
  slug: string;
  content: string;
  status: string;
  image: FileList;
}