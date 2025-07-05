import express from "express";
import {
  getTransactions,
  addTransaction,
} from "../controllers/finance.controller.js";

const financeRouter = express.Router();

financeRouter.get("/transactions", getTransactions);
financeRouter.post("/transactions", addTransaction);

export default financeRouter;
