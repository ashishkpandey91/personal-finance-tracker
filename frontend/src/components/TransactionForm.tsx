import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Tag, FileText, IndianRupee } from "lucide-react";
import { Transaction } from "@/types/finance";
import axios from "axios"; // assuming you use axios

interface TransactionFormProps {
  onAddTransaction: (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => void;
  onClose: () => void;
}

export const TransactionForm = ({
  onAddTransaction,
  onClose,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Fetch categories from your API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data); // assuming array of strings
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axios.post("/api/categories", { name: newCategory });
      const added = res.data.name; // assume response returns new category

      setCategories((prev) => [...prev, added]);
      setFormData((prev) => ({ ...prev, category: added }));
      setNewCategory("");
      setShowAddNew(false);
    } catch (error) {
      console.error("Error adding category", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.description || !formData.category) return;

    onAddTransaction({
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4 mt-4">
          {/* Type Selection */}
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "income" | "expense") =>
                setFormData((prev) => ({ ...prev, type: value }))
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

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <Label htmlFor="description">Description</Label>
            <div className="relative mt-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="description"
                placeholder="What was this for?"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                if (value === "add_new") {
                  setShowAddNew(true);
                  setFormData((prev) => ({ ...prev, category: "" }));
                } else {
                  setShowAddNew(false);
                  setFormData((prev) => ({ ...prev, category: value }));
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <Tag className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {/* {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))} */}
                <SelectItem value="add_new">
                  Add new category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add New Category Field */}
          {showAddNew && (
            <div className="flex gap-2 items-end">
              <Input
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={handleAddNewCategory}>
                Add
              </Button>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <Label htmlFor="date">Date</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Submit / Cancel */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                formData.type === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              Add {formData.type === "income" ? "Income" : "Expense"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
