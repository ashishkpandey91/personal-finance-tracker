import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Search, Filter, PieChart } from 'lucide-react';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { SpendingChart } from '@/components/SpendingChart';
import { BudgetCard } from '@/components/BudgetCard';
import { CategoryChart } from '@/components/CategoryChart';
import { MobileBottomNav } from '@/components/MobileBottomNav';

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
  const [selectedPeriod, setSelectedPeriod] = useState('week');
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personal Finance Tracker
            </h1>
            <p className="text-gray-600 mt-1">Take control of your financial future</p>
          </div>
          <Button 
            onClick={() => setShowTransactionForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {balance >= 0 ? 'Positive balance' : 'Negative balance'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tab List - Hidden on Mobile */}
          <TabsList className="hidden md:grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {budgets.map(budget => (
                <BudgetCard 
                  key={budget.category} 
                  budget={budget}
                  onUpdateBudget={updateBudget}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList transactions={transactions} />
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map(budget => (
                <BudgetCard 
                  key={budget.category} 
                  budget={budget}
                  onUpdateBudget={updateBudget}
                  detailed={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Transaction Form Modal */}
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
