import { Router } from "express";
import { createUser, getCurrentUser, loginUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", createUser);
authRouter.post("/login", loginUser);
authRouter.get("/user", getCurrentUser);

export default authRouter;
