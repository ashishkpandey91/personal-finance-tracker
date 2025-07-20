import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { newBudget } from "@/types/finance";
import authApi from "@/utils/api";

type Budget = {
  id: string;
  category: string;
  budget: number;
  month: string;
  year: string;
  expense: string;
};

type BudgetState = {
  entities: Budget[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  createStatus: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: BudgetState = {
  entities: [],
  loading: "idle",
  createStatus: "idle",
};

export const getBudgets = createAsyncThunk("budgets/get", async () => {
  const response = await authApi.get<Budget[]>("/budgets");
  return response.data;
});

export const createBudget = createAsyncThunk(
  "budgets/create",
  async (newBudget: newBudget) => {
    const response = await authApi.post<Budget>("/budgets", newBudget);
    return response.data;
  }
);
// Update Budget
export const updateBudget = createAsyncThunk(
  "budgets/update",
  async (updatedBudget: Budget) => {
    const response = await authApi.put<Budget>(
      `/budgets/${updatedBudget.id}`,
      updatedBudget
    );
    return response.data;
  }
);

// Delete Budget
export const deleteBudget = createAsyncThunk(
  "budgets/delete",
  async (id: string) => {
    await authApi.delete(`/budgets/${id}`);
    return id;
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(getBudgets.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload;
      })
      .addCase(getBudgets.rejected, (state) => {
        state.loading = "failed";
      })

      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.createStatus = "pending";
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.entities = [action.payload, ...state.entities];
      })
      .addCase(createBudget.rejected, (state) => {
        state.createStatus = "failed";
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
      })

      // Delete budget
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.entities = state.entities.filter((b) => b.id !== action.payload);
      });
  },
});

export const budgetReducer = budgetSlice.reducer;
