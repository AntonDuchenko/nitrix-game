import WebSocket from "ws";
import {
  handleJoinRoom,
  handleReconnectRoom,
  handleAttack,
  handleDisconnect,
} from "../controllers/socket.controller";
import { authenticateSocket } from "../middlewares/socket.middleware";
// import { authenticateSocket } from "../middlewares/socket.middleware";

export function initSocketController(wss: WebSocket.Server) {
  wss.on("connection", (socket, req) => {
    authenticateSocket(socket, req, () => {
      socket.on("message", (message) => {
        const { type, payload } = JSON.parse(message.toString());
        switch (type) {
          case "joinRoom":
            return handleJoinRoom(socket, wss);

          case "reconnectRoom":
            return handleReconnectRoom(socket);

          case "attack":
            return handleAttack(socket, wss, payload);

          case "disconnect":
            return handleDisconnect(socket, wss);

          default:
            return;
        }
      });
    });
  });
}
