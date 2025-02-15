import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db";
import authRouter from "./router/auth.router";
import gameRouter from "./router/game.router";
import { Server, Socket } from "socket.io";
import http from "http";
import { IEntity } from "./types";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

function createServer() {
  connectDB();

  const app = express();
  app.use(json());
  app.use(cors());
  app.use("/auth", authRouter);
  app.use("/game", gameRouter);

  const server = http.createServer(app);
  const io = new Server(server, {
    transports: ["websocket"],
  });

  const rooms = new Map<string, Map<string, IEntity>>();
  const disconnectedPlayers = new Map<
    string,
    { room: string; entity: IEntity }
  >();
  let roomName = `room-${Date.now()}`;

  io.use((socket: AuthenticatedSocket, next) => {
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
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const playerId = socket.user?.id;

    socket.on("joinRoom", () => {
      socket.join(roomName);

      socket.emit("joinedRoom", {
        roomName,
      });

      const clientsInRoom = io.sockets.adapter.rooms.get(roomName)?.size || 0;

      if (!playerId) return;

      const defaultEntity = {
        id: playerId,
        type: "player",
        health: 10,
      };

      if (!rooms.has(roomName)) {
        rooms.set(roomName, new Map());
      }

      const roomEntities = rooms.get(roomName);
      roomEntities?.set(playerId, defaultEntity);

      if (clientsInRoom === 2 && roomEntities) {
        io.sockets.in(roomName).emit("startGame", {
          roomName,
          players: Array.from(roomEntities.values()),
          turn: null,
        });

        roomName = `room-${Date.now()}`;
      }
    });

    socket.on("reconnectRoom", () => {
      const playerData = disconnectedPlayers.get(playerId);

      if (playerData) {
        const { room, entity } = playerData;

        if (rooms.has(room)) {
          socket.join(room);
          entity.id = playerId;
          const roomEntities = rooms.get(room);
          roomEntities?.set(playerId, entity);
          disconnectedPlayers.delete(playerId);

          if (!roomEntities) return;

          io.to(room).emit("startGame", {
            roomName,
            players: Array.from(roomEntities.values()),
            turn: null,
          });

          console.log(`Player ${playerId} reconnected to room ${room}`);
        }
      } else {
        socket.emit("reconnectError");
      }
    });

    socket.on("attack", (data) => {
      const currentRoom = rooms.get(data.roomName);

      if (!currentRoom) return;

      const targetEntity = currentRoom.get(playerId);

      if (!targetEntity) return;

      targetEntity.turn = data.actions;

      const opponent = Array.from(currentRoom.values()).find(
        (entity) => entity.id !== playerId
      );

      if (!opponent) return;

      if (opponent.turn && targetEntity.turn) {
        if (opponent.turn.attack !== targetEntity.turn.defend) {
          targetEntity.health -= 1;
        }

        if (targetEntity.turn.attack !== opponent.turn.defend) {
          opponent.health -= 1;
        }

        targetEntity.turn = null;
        opponent.turn = null;

        io.to(data.roomName).emit("entityUpdated", [
          {
            entityId: targetEntity.id,
            updates: { health: targetEntity.health },
          },
          {
            entityId: opponent.id,
            updates: { health: opponent.health },
          },
        ]);
      }
    });

    socket.on("disconnect", () => {
      if (!playerId) return;

      for (const [room, entities] of rooms.entries()) {
        if (entities.has(playerId)) {
          const playerEntity = entities.get(playerId);

          if (playerEntity) {
            disconnectedPlayers.set(playerId, { room, entity: playerEntity });
          }

          entities.delete(playerId);

          if (entities.size === 0) {
            rooms.delete(room);
          } else {
            io.to(room).emit("playerDisconnected", { playerId: playerId });
          }
          break;
        }
      }

      console.log(`User ${playerId} disconnected.`);
    });
  });

  io.listen(4000);

  return app;
}

export default createServer;
