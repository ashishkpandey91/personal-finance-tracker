import { TabsContent } from "@/components/ui/tabs";
import { SpendingChart } from "./SpendingChart";
import { CategoryChart } from "./CategoryChart";
import { TransactionList } from "./TransactionList";
import { BudgetCard } from "./BudgetCard";
import { FinanceNews } from "./FinanceNews";
import { Transaction, Budget } from "@/types/finance";
import { FinanceHeader } from "./FinanceHeader";
import { OverviewCards } from "./OverviewCards";
import { useState } from "react";
import { TransactionForm } from "./TransactionForm";

interface FinanceTabsContentProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (category: string, limit: number) => void;
}

export const FinanceTabsContent = ({
  transactions: initialTransactions,
  budgets: initialBudgets,
  onUpdateBudget,
}: FinanceTabsContentProps) => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    if (transaction.type === "expense") {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === transaction.category
            ? { ...budget, spent: budget.spent + transaction.amount }
            : budget
        )
      );
    }

    setShowTransactionForm(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="block md:hidden">
            <FinanceHeader
              onAddTransaction={() => setShowTransactionForm(true)}
            />

            <OverviewCards
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          </div>
          {showTransactionForm && (
            <TransactionForm
              onAddTransaction={addTransaction}
              onClose={() => setShowTransactionForm(false)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.category}
              budget={budget}
              onUpdateBudget={onUpdateBudget}
              detailed={true}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionList transactions={transactions} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart transactions={transactions} />
          <CategoryChart transactions={transactions} />
        </div>
      </TabsContent>

      <TabsContent value="news" className="space-y-6">
        <FinanceNews />
      </TabsContent>
    </>
  );
};
