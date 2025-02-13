import { Request, Response } from "express";
import {
  createUser,
  genarateToken,
  getUserByEmail,
} from "../services/auth.services";
import codeStatuses from "../constants";
import bcrypt from "bcrypt";
import { handleError } from "../utils/handleError";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (user) {
      res
        .status(codeStatuses.BAD_REQUEST_CODE_STATUS)
        .json({ message: "User already exists" });
    }

    const hashdPassword = await bcrypt.hash(password, 10);

    await createUser(email, hashdPassword);

    res
      .status(codeStatuses.CREATED_CODE_STATUS)
      .json({ message: "User created successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      res
        .status(codeStatuses.BAD_REQUEST_CODE_STATUS)
        .json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(codeStatuses.BAD_REQUEST_CODE_STATUS)
        .json({ message: "Invalid password" });
    } else {
      const token = genarateToken(user._id.toString());

      res
        .status(codeStatuses.SUCCESS_CODE_STATUS)
        .json({ message: "Login successful", token });
    }
  } catch (error) {
    handleError(error, res);
  }
};
