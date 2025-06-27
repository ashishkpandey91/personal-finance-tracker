import { Router } from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import financeRouter from "./finance.routes.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRouter);

router.use(checkAuth);
router.use("/categories", categoryRouter);
router.use("/finance", financeRouter);

export default router;
