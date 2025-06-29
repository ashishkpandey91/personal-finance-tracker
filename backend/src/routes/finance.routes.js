import express from "express";
import {
  getTransactions,
  addTransaction,
  getBudgets,
  updateBudget,
} from "../controllers/finance.controller.js";

const financeRouter = express.Router();

financeRouter.get("/transactions", getTransactions);
financeRouter.post("/transactions", addTransaction);
financeRouter.get("/budgets", getBudgets);
financeRouter.put("/budgets", updateBudget);

export default financeRouter;
