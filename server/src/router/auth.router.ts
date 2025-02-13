import express from "express";
import { checkToken, login, register } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/check-token", checkToken);

export default authRouter;
