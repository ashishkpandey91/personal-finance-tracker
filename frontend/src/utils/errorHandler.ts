// utils/handleError.ts
export function handleError(error: any) {
  const message =
    error?.response?.data?.error || // backend-sent error
    error?.message ||               // network/axios error
    "An unexpected error occurred";

  return { error: message, data: null };
}
