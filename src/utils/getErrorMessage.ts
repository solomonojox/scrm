import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Something went wrong.";
  }

  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }

  const { data, status } = error.response;

  // ASP.NET Validation Errors
  if (data?.errors) {
    return Object.values(data.errors)
      .flat()
      .join("\n");
  }

  // Your backend format
  if (typeof data?.responseMessage === "string") {
    return data.responseMessage;
  }

  // Common API formats
  if (typeof data?.message === "string") {
    return data.message;
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof data?.title === "string") {
    return data.title;
  }

  switch (status) {
    case 400:
      return "Bad Request.";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "Forbidden.";
    case 404:
      return "Resource not found.";
    case 500:
      return "Internal server error.";
    default:
      return "Something went wrong.";
  }
};