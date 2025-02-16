import { Server } from "socket.io";
import {
  handleJoinRoom,
  handleReconnectRoom,
  handleAttack,
  handleDisconnect,
} from "../controllers/socket.controller";
import { authenticateSocket } from "../middlewares/socket.middleware";

export function initSocketController(io: Server) {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.on("joinRoom", () => handleJoinRoom(socket, io));
    socket.on("reconnectRoom", () => handleReconnectRoom(socket, io));
    socket.on("attack", (data) => handleAttack(socket, io, data));
    socket.on("disconnect", () => handleDisconnect(socket, io));
  });
}
