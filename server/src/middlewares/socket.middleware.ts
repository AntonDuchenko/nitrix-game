import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthSocket } from "../types";

export function authenticateSocket(
  socket: IAuthSocket,
  next: (err?: Error) => void
) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "default-secret"
    ) as JwtPayload;
    socket.user = decoded;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
}
