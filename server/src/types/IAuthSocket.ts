import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

export interface IAuthSocket extends Socket {
  user?: JwtPayload;
}
