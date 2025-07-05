// src/components/BudgetCard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Edit2, Check, X, AlertTriangle, MoreVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Budget } from "@/types/finance";

interface BudgetCardProps {
  budget: Budget;
  onUpdateBudget: (category: string, budget: number) => void;
  onDeleteBudget: (id: string) => void;
  detailed?: boolean;
}

export const BudgetCard = ({ budget, onUpdateBudget, onDeleteBudget, detailed = false }: BudgetCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budget.budget);

  const percentage = Math.min((budget.expense / budget.budget) * 100, 100);
  const isOverBudget = budget.expense > budget.budget;
  const isNearLimit = percentage > 80 && !isOverBudget;

  const handleSave = () => {
    if (!isNaN(newLimit) && newLimit > 0) {
      onUpdateBudget(budget.category, newLimit);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewLimit(budget.budget);
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

            {isEditing ? (
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
            ) : (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  side="bottom"
                  align="end"
                  className="bg-white border shadow-md rounded-md py-1 w-28 z-50"
                >
                  <DropdownMenu.Item
                    className="text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    Update
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="text-sm px-3 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                    onClick={() => onDeleteBudget(budget.id)}
                  >
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent</span>
            <span className={`font-bold ${isOverBudget ? "text-red-600" : "text-gray-800"}`}>
              ₹{Number(budget.expense).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-600">Budget</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">₹</span>
                <Input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  className="w-20 h-8 text-sm"
                />
              </div>
            ) : (
              <span className="font-bold text-gray-800">₹{Number(budget.budget).toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-2">
            <Progress
              value={percentage}
              className="h-2"
              style={{
                background: isOverBudget ? "#fecaca" : isNearLimit ? "#fed7aa" : "#e5e7eb",
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{percentage.toFixed(0)}% used</span>
              <span>₹{(budget.budget - budget.expense).toFixed(2)} remaining</span>
            </div>
          </div>

          {detailed && (
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Daily average:</span>
                <span>₹{(budget.expense / 30).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Projected month:</span>
                <span className={budget.expense * 30 > budget.budget ? "text-red-600" : "text-green-600"}>
                  ₹{(budget.expense * 30).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
