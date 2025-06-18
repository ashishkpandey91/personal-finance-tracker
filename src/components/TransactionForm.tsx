
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { Transaction } from '@/pages/Index';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  onClose: () => void;
}

const categories = [
  'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Work', 'Other'
];

export const TransactionForm = ({ onAddTransaction, onClose }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      return;
    }

    onAddTransaction({
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">Add Transaction</CardTitle>
              <CardDescription>Record your income or expense</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'income' | 'expense') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <div className="relative mt-1">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="description"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className={`flex-1 ${
                  formData.type === 'income' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                Add {formData.type === 'income' ? 'Income' : 'Expense'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
