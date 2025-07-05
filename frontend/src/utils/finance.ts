export type Transaction = {
  type: "income" | "expense";
  amount: number | string;
};

export const calculateFinanceSummary = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, balance };
};
