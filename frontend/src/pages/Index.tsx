import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FinanceHeader } from "@/components/FinanceHeader";
import { OverviewCards } from "@/components/OverviewCards";
import { FinanceTabsContent } from "@/components/FinanceTabsContent";
import { Transaction, Budget } from "@/types/finance";
import { CircleUser, LogOut } from "lucide-react";
import { financeService } from "@/services/financeService";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedTransactions, fetchedBudgets] = await Promise.all([
          financeService.getTransactions(),
          financeService.getBudgets(),
        ]);
        setTransactions(fetchedTransactions);
        setBudgets(fetchedBudgets);
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    try {
      const newTransaction = await financeService.addTransaction(transaction);
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
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const updateBudget = async (category: string, limit: number) => {
    try {
      const updated = await financeService.updateBudget(category, limit);
      setBudgets((prev) => {
        const exists = prev.find((b) => b.category === category);
        if (exists) {
          return prev.map((b) => (b.category === category ? updated : b));
        } else {
          return [...prev, updated];
        }
      });
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <>
      <header className="w-full relative z-50">
        <div className="flex items-center justify-end h-full px-4 md:px-10 py-2 bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 relative">
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <p className="font-semibold">Ashish Kumar Pandey</p>
            <div className="rounded-full w-8 h-8 flex items-center justify-center">
              <CircleUser />
            </div>
          </div>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-4 mt-2 w-40 bg-white rounded-md shadow-lg border z-50"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pb-8 w-full">
        <div className="container mx-auto px-3 md:px-4 py-8 pt-0 md:pt-8 max-w-7xl">
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
              onAddTransaction={() => setShowTransactionForm(true)}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              transactions={transactions}
              balance={balance}
              budgets={budgets}
              onUpdateBudget={updateBudget}
            />
          </Tabs>

          <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          <Sheet
            open={showTransactionForm}
            onOpenChange={setShowTransactionForm}
          >
            <SheetContent className="w-[98vw] sm:w-[540px] max-w-full">
              <SheetHeader>
                <SheetTitle>Add Transaction</SheetTitle>
                <SheetDescription>
                  Record your income or expense
                </SheetDescription>
              </SheetHeader>
              <TransactionForm
                onAddTransaction={addTransaction}
                onClose={() => setShowTransactionForm(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Index;
