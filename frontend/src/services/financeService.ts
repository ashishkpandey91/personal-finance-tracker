import axios from "axios";
import { Transaction } from "@/types/finance";

const BASE_URL = "http://localhost:3001/v1/api/finance";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const financeService = {
  getTransactions: async () => {
    const res = await axios.get(`${BASE_URL}/transactions`, getAuthHeader());
    return res.data;
  },

  getBudgets: async () => {
    const res = await axios.get(`${BASE_URL}/budgets`, getAuthHeader());
    return res.data;
  },

  addTransaction: async (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const res = await axios.post(
      `${BASE_URL}/transactions`,
      transaction,
      getAuthHeader()
    );

    return res.data;
  },

  setBudget: async (
    category: string,
    budget: number,
    month: string,
    year: number
  ) => {
    const res = await axios.post(
      `${BASE_URL}/budgets`,
      { category, budget, month, year },
      getAuthHeader()
    );
    return res.data;
  },
  updateBudget: async (category: string, limit: number) => {
    const res = await axios.put(
      `${BASE_URL}/budgets`,
      { category, limit },
      getAuthHeader()
    );
    return res.data;
  },
};
