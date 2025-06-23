import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", createUser);
authRouter.post("/login", loginUser);

export default authRouter;
