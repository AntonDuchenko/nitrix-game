import user from "../models/user";
import jwt from "jsonwebtoken";
import constants from "../constants";

export const getUserByEmail = async (email: string) => {
  return await user.findOne({ email });
};

export const getUserById = async (id: string) => {
  return await user.findById(id);
};

export const createUser = async (email: string, password: string) => {
  return await user.create({ email, password });
};

export const genarateToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    constants.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const isTokenValid = (token: string) => {
  return jwt.verify(token, constants.JWT_SECRET);
};
