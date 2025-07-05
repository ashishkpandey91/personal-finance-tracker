import { Router } from "express";
import {
  getBudgets,
  setBudget,
  updateBudget,
} from "../controllers/budget.controller.js";

const budgetRouter = Router();

budgetRouter.post("/", setBudget);
budgetRouter.get("/", getBudgets);
budgetRouter.put("/", updateBudget);

export default budgetRouter;
