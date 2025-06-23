import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FinanceHeader } from "@/components/FinanceHeader";
import { OverviewCards } from "@/components/OverviewCards";
import { FinanceTabsContent } from "@/components/FinanceTabsContent";
import { Transaction, Budget } from "@/types/finance";
import { CircleUser } from "lucide-react";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "expense",
      amount: 45.5,
      description: "Grocery shopping",
      category: "Food",
      date: "2024-01-15",
      timestamp: Date.now() - 86400000,
    },
    {
      id: "2",
      type: "income",
      amount: 2500.0,
      description: "Salary",
      category: "Work",
      date: "2024-01-15",
      timestamp: Date.now() - 172800000,
    },
    {
      id: "3",
      type: "expense",
      amount: 25.0,
      description: "Coffee subscription",
      category: "Food",
      date: "2024-01-14",
      timestamp: Date.now() - 259200000,
    },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: "Food", limit: 500, spent: 70.5 },
    { category: "Transportation", limit: 200, spent: 45.0 },
    { category: "Entertainment", limit: 150, spent: 25.0 },
  ]);

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update budget spent amount
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

  const updateBudget = (category: string, limit: number) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      } else {
        return [...prev, { category, limit, spent: 0 }];
      }
    });
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
      <header className="w-full">
        <div className="flex items-center justify-end h-full px-4 md:px-10 py-2 bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100">
          <div>
            <p className="font-semibold cursor-pointer">Ashish Kumar Pandey</p>
          </div>
          <div className="rounded-full w-8 h-8 flex items-center justify-center ml-2 cursor-pointer">
            <CircleUser />
          </div>
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pb-8 w-full">
        <div className="container mx-auto px-4 py-8 pt-0 md:pt-8 max-w-7xl">
          <div className="hidden md:block">
            <FinanceHeader
              onAddTransaction={() => setShowTransactionForm(true)}
            />

            <OverviewCards
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="hidden md:grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            <FinanceTabsContent
              transactions={transactions}
              budgets={budgets}
              onUpdateBudget={updateBudget}
            />
          </Tabs>

          <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

          {showTransactionForm && (
            <TransactionForm
              onAddTransaction={addTransaction}
              onClose={() => setShowTransactionForm(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
