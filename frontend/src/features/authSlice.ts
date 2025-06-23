import { AppUser } from "@/type/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authstate {
  status: boolean;
  userData: null | AppUser;
}

const initialState: authstate = {
  status: false,
  userData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AppUser>) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
