import { Router } from "express";
import {
  addCategory,
  getUserCategories,
  setCategoryBudget,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/", addCategory);
categoryRouter.get("/", getUserCategories);
categoryRouter.post("/budget/:categoryId", setCategoryBudget);

export default categoryRouter;
