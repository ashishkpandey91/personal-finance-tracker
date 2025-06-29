import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/authSlice";
import { transactionReducer } from "@/features/transactionSlice";
import { categoryReducer } from "@/features/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
