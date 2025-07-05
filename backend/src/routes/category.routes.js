import { Router } from "express";
import {
  addCategory,
  getUserCategories,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/", addCategory);
categoryRouter.get("/", getUserCategories);

export default categoryRouter;
