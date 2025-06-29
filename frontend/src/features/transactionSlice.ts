import { Transaction } from "@/types/finance";
import authApi from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type TransactionState = {
  entities: Transaction[];
  loading: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: TransactionState = {
  entities: [],
  loading: "idle",
};

export const fetchTransactions = createAsyncThunk(
  "transactions/get",
  async () => {
    const response = await authApi.get<Transaction[]>("/finance/transactions");
    return response.data;
  }
);

export const addNewTransaction = createAsyncThunk(
  "transactions/add",
  async (newTransaction: Transaction) => {
    const response = await authApi.post<Transaction>(
      "/finance/transactions",
      newTransaction
    );
    return response.data;
  }
);

// Then, handle actions in your reducers:
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.entities = action.payload;
    });

    builder.addCase(fetchTransactions.rejected, (state) => {
      state.loading = "failed";
    });
    builder.addCase(addNewTransaction.fulfilled, (state, action) => {
      state.entities = [action.payload, ...state.entities];
    });
  },
});

export const transactionReducer = transactionSlice.reducer;
