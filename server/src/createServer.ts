import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db";
import authRouter from "./router/auth.router";
import { Server } from "socket.io";
import http from "http";
import { initSocketController } from "./router/socket.router";

function createServer() {
  connectDB();

  const app = express();
  app.use(json());
  app.use(cors());
  app.use("/auth", authRouter);

  const server = http.createServer(app);
  const io = new Server(server, {
    transports: ["websocket"],
  });

  initSocketController(io);

  server.listen(4000, () => console.log("Socket running on port 4000"));

  return app;
}

export default createServer;
