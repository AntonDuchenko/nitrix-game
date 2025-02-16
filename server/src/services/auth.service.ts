import user from "../models/user";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email: string) => {
  return await user.findOne({ email });
};

export const createUser = async (email: string, password: string) => {
  return await user.create({ email, password });
};

export const genarateToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET ?? "default-secret",
    { expiresIn: "1d" }
  );
};

export const isTokenValid = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET ?? "default-secret");
};
