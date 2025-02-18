import express, { json } from "express";
import WebSocket from "ws";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db";
import authRouter from "./router/auth.router";
import { initSocketController } from "./router/socket.router";

function createServer() {
  connectDB();

  const app = express();
  app.use(json());
  app.use(cors());
  app.use("/auth", authRouter);

  const wss = new WebSocket.Server({ port: 4000 }, () => console.log("Socket running on port 4000"))

  initSocketController(wss);

  return app;
}

export default createServer;
