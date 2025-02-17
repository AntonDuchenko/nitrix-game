/* eslint-disable @typescript-eslint/no-unused-vars */
import { handleApiError } from "../utils/hadleApiError";
import { instance } from "./instance";
import Cookies from "js-cookie";

export const registration = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await instance.post("/auth/register", { email, password });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await instance.post("/auth/login", { email, password });
    Cookies.set("auth_token", response.data.token);
    Cookies.set("userId", response.data.userId);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const checkToken = async (token: string) => {
  try {
    const response = await instance.get("/auth/check-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
