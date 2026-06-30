import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserProfile } from "@/services/user/user.service";
import { User } from "./user.types";

export interface UserState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: true,
  initialized: false,
  error: null,
};

export const fetchUser = createAsyncThunk("user/fetch", async (_, thunkAPI) => {
  try {
    const res = await getUserProfile();

    return res.data.data as User;
  } catch {
    return thunkAPI.rejectWithValue("Unauthorized");
  }
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
      })

      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = slice.actions;

export default slice.reducer;
