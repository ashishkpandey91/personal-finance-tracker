
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/TransactionForm';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { FinanceHeader } from '@/components/FinanceHeader';
import { OverviewCards } from '@/components/OverviewCards';
import { FinanceTabsContent } from '@/components/FinanceTabsContent';
import { Transaction, Budget } from '@/types/finance';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'expense',
      amount: 45.50,
      description: 'Grocery shopping',
      category: 'Food',
      date: '2024-01-15',
      timestamp: Date.now() - 86400000
    },
    {
      id: '2',
      type: 'income',
      amount: 2500.00,
      description: 'Salary',
      category: 'Work',
      date: '2024-01-15',
      timestamp: Date.now() - 172800000
    },
    {
      id: '3',
      type: 'expense',
      amount: 25.00,
      description: 'Coffee subscription',
      category: 'Food',
      date: '2024-01-14',
      timestamp: Date.now() - 259200000
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food', limit: 500, spent: 70.50 },
    { category: 'Transportation', limit: 200, spent: 45.00 },
    { category: 'Entertainment', limit: 150, spent: 25.00 }
  ]);

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update budget spent amount
    if (transaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget
      ));
    }
    
    setShowTransactionForm(false);
  };

  const updateBudget = (category: string, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, limit } : b);
      } else {
        return [...prev, { category, limit, spent: 0 }];
      }
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <FinanceHeader onAddTransaction={() => setShowTransactionForm(true)} />
        
        <OverviewCards 
          balance={balance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden md:grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
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
  );
};

export default Index;
