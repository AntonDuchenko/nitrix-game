import axios from "axios";

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.data.message || "An error occurred while fetching data"
    );
  } else {
    throw new Error("Something went wrong. Please try again later.");
  }
};
