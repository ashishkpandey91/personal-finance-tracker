export type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
};

export type Category = {
  id: string;
  name: string;
};
