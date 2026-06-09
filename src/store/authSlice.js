import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/client";

// ─── Async Thunks ──────────────────────────────────────────────────────────

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Backend envelope: { success: true, message: "...", data: { id, email, ... } }
      const response = await apiClient.post("/auth/signup", { email, password });
      return response.data; // full envelope — success message used in UI
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      // Backend login returns: { access_token, token_type } directly (NOT wrapped in data envelope)
      const response = await apiClient.post("/auth/login", { email, password });
      const { access_token } = response.data;

      // Save token in localStorage
      localStorage.setItem("resumehance_token", access_token);

      // Fetch user profile immediately after successful login
      const userDetails = await dispatch(fetchCurrentUser()).unwrap();

      return { token: access_token, user: userDetails };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed.");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Backend envelope: { success: true, message: "...", data: { id, email, ... } }
      const response = await apiClient.get("/auth/me");
      // Unwrap the data field from the envelope
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load user profile.");
    }
  }
);

// ─── Initial State ─────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem("resumehance_token") || null,
  isAuthenticated: !!localStorage.getItem("resumehance_token"),
  loading: false,
  error: null,
  signupSuccess: false,
  signupMessage: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("resumehance_token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.signupSuccess = false;
      state.signupMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSignupSuccess: (state) => {
      state.signupSuccess = false;
      state.signupMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Signup ──────────────────────────────────────────────────────────
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.signupSuccess = true;
        // Capture the backend success message (e.g. "User created successfully.")
        state.signupMessage = action.payload?.message || "Account created successfully!";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.signupSuccess = false;
      })

      // ── Login ───────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ── Fetch Current User ───────────────────────────────────────────────
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("resumehance_token");
      });
  },
});

export const { logout, clearError, resetSignupSuccess } = authSlice.actions;
export default authSlice.reducer;
