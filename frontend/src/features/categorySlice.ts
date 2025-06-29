import { Category } from "@/types/finance";
import authApi from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserCategories = createAsyncThunk(
  "categories/get",
  async () => {
    const response = await authApi.get<Category[]>("/categories");
    return response.data;
  }
);

type AddCategoryApiResponse = {
  message: string;
  category: Category;
};

export const addNewCategory = createAsyncThunk(
  "categories/add",
  async (categoryName: string) => {
    const payload = { name: categoryName };
    const response = await authApi.post<AddCategoryApiResponse>(
      "/categories",
      payload
    );

    return response.data.category;
  }
);

type CategoryState = {
  entities: Category[];
  loading: "idle" | "pending" | "succeeded" | "failed";
};

const initialState: CategoryState = {
  loading: "idle",
  entities: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserCategories.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(getUserCategories.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.entities = action.payload;
    });

    builder.addCase(addNewCategory.fulfilled, (state, action) => {
      state.entities = [action.payload, ...state.entities];
    });
  },
});

export const categoryReducer = categorySlice.reducer;
