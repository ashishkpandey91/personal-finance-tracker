
import { TabsContent } from '@/components/ui/tabs';
import { SpendingChart } from './SpendingChart';
import { CategoryChart } from './CategoryChart';
import { TransactionList } from './TransactionList';
import { BudgetCard } from './BudgetCard';
import { FinanceNews } from './FinanceNews';
import { Transaction, Budget } from '@/types/finance';

interface FinanceTabsContentProps {
  transactions: Transaction[];
  budgets: Budget[];
  onUpdateBudget: (category: string, limit: number) => void;
}

export const FinanceTabsContent = ({ transactions, budgets, onUpdateBudget }: FinanceTabsContentProps) => {
  return (
    <>
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
              onUpdateBudget={onUpdateBudget}
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
              onUpdateBudget={onUpdateBudget}
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

      <TabsContent value="news" className="space-y-6">
        <FinanceNews />
      </TabsContent>
    </>
  );
};
