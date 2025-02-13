import user from "../models/user";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email: string) => {
  return await user.findOne({ email });
};

export const createUser = async (email: string, password: string) => {
  return await user.create({ email, password });
};

export const genarateToken = (uuid: string) => {
  return jwt.sign(
    {
      uuid,
    },
    process.env.JWT_SECRET || "",
    { expiresIn: "1d" }
  );
};
