import { Router } from "express";
import {
  deleteBudget,
  getBudgets,
  setBudget,
  updateBudget,
} from "../controllers/budget.controller.js";

const budgetRouter = Router();

budgetRouter.post("/", setBudget);
budgetRouter.get("/", getBudgets);
budgetRouter.put("/:id", updateBudget);
budgetRouter.delete("/:id", deleteBudget);

export default budgetRouter;
