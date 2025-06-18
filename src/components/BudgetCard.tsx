
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Target, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { Budget } from '@/pages/Index';

interface BudgetCardProps {
  budget: Budget;
  onUpdateBudget: (category: string, limit: number) => void;
  detailed?: boolean;
}

export const BudgetCard = ({ budget, onUpdateBudget, detailed = false }: BudgetCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budget.limit.toString());
  
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
  const isOverBudget = budget.spent > budget.limit;
  const isNearLimit = percentage > 80 && !isOverBudget;

  const handleSave = () => {
    const limit = parseFloat(newLimit);
    if (!isNaN(limit) && limit > 0) {
      onUpdateBudget(budget.category, limit);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewLimit(budget.limit.toString());
    setIsEditing(false);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-lg font-bold text-gray-800">{budget.category}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isOverBudget && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Over Budget
              </Badge>
            )}
            {isNearLimit && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                Near Limit
              </Badge>
            )}
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="p-2 hover:bg-green-100 rounded-full text-green-600"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="p-2 hover:bg-red-100 rounded-full text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Spent</span>
            <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
              ${budget.spent.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Budget</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">$</span>
                <Input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-20 h-8 text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            ) : (
              <span className="font-bold text-gray-800">${budget.limit.toFixed(2)}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-2"
              style={{
                background: isOverBudget ? '#fecaca' : isNearLimit ? '#fed7aa' : '#e5e7eb'
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{percentage.toFixed(0)}% used</span>
              <span>${(budget.limit - budget.spent).toFixed(2)} remaining</span>
            </div>
          </div>

          {detailed && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Daily average:</span>
                  <span>${(budget.spent / 30).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected month:</span>
                  <span className={budget.spent * 30 > budget.limit ? 'text-red-600' : 'text-green-600'}>
                    ${(budget.spent * 30).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
