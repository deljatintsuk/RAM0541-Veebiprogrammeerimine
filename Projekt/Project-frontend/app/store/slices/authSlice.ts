import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AuthService from "../../services/auth.service";
import { setMessage } from "./messageSlice";
import { IUser } from "../../types";

let user: IUser | null = null;
try {
  const userJSON = localStorage.getItem("user");
  if (userJSON) {
    user = JSON.parse(userJSON);
  }
} catch (error) {
  console.error("Could not parse user from localStorage", error);
  localStorage.removeItem("user");
}


interface AuthState {
  isLoggedIn: boolean;
  user: IUser | null;
}

const initialState: AuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, firstname, lastname, password }: any, thunkAPI) => {
    try {
      const response = await AuthService.register(username, email, firstname, lastname, password);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: any, thunkAPI) => {
    try {
      const data = await AuthService.login(username, password);
      return { user: data };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  AuthService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: IUser }>) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;