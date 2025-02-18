import jwt, { JwtPayload } from "jsonwebtoken";
import constants from "../constants";
import { IAuthSocket } from "../types";
import { IncomingMessage } from "http";

export function authenticateSocket(
  socket: IAuthSocket,
  req: IncomingMessage,
  next: (err?: Error) => void
) {
  const token = req.headers.cookie
    ?.split(" ")[0]
    .split("=")[1]
    .replace(";", "");

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, constants.JWT_SECRET) as JwtPayload;
    socket.userId = decoded.id;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
}
