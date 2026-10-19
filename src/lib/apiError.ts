// Pulls a human-readable message out of an Axios error returned by the API.
// NestJS error bodies look like { statusCode, message, error } where `message`
// is either a string or an array of strings (validation errors).
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const data = (error as any)?.response?.data;
  const message = data?.message;

  if (Array.isArray(message)) {
    return message.filter(Boolean).join(". ");
  }
  if (typeof message === "string" && message.trim()) {
    return message;
  }
  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
