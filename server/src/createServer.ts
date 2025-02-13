import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db";
import authRouter from "./router/auth.router";

function createServer() {
  connectDB();

  const app = express();
  app.use(json());
  app.use(cors());
  app.use("/api", authRouter);

  return app;
}

export default createServer;
