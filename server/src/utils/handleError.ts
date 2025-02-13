import codeStatuses from "../constants";
import { Response } from "express";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res
      .status(codeStatuses.INTERNAL_SERVER_ERROR_CODE_STATUS)
      .json({ error: error.message });
  } else {
    res
      .status(codeStatuses.INTERNAL_SERVER_ERROR_CODE_STATUS)
      .json({ error: "Unknown error" });
  }
};
