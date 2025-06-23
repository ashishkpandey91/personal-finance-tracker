import { AppwriteException } from "appwrite";

export function handleError(error: unknown) {
  let message: string = "Something went wrong..";

  if (error instanceof AppwriteException || error instanceof Error) {
    message = error.message;
    console.log("Error From:", error);
  }

  return { data: null, error: { message } };
}
