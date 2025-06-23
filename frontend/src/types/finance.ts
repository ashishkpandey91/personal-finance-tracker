
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  timestamp: number;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}
