import WebSocket from "ws";
import { JwtPayload } from "jsonwebtoken";

export interface IAuthSocket extends WebSocket {
  userId?: JwtPayload;
}
