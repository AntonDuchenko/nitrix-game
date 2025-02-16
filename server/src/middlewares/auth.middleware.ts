import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import codes from "./../constants";

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res
      .status(codes.UNAUTHORIZED_CODE_STATUS)
      .json({ message: "Authorization header is missing" });
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    res
      .status(codes.BAD_REQUEST_CODE_STATUS)
      .json({ message: 'Invalid authorization type. Expected "Bearer"' });
  }

  if (!token) {
    res
      .status(codes.UNAUTHORIZED_CODE_STATUS)
      .json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "", (err, user) => {
    if (err) {
      res
        .status(codes.FORBIDDEN_CODE_STATUS)
        .json({ message: "Invalid token" });
    }

    const decodedPayload = user as JwtPayload;

    req.user = {
      id: decodedPayload.id,
    };

    next();
  });
};
