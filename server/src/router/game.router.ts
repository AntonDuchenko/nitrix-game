import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";

const gameRouter = express.Router();

gameRouter.get("/", authenticateToken, (req, res) => {
  console.log(req.body);
  
  res.send("Hello World!");
});

export default gameRouter;
