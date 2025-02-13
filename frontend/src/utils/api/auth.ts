/* eslint-disable @typescript-eslint/no-unused-vars */
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
    throw new Error("Registration failed");
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

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
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
    throw new Error("Login failed");
  }
};
