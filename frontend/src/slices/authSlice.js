/**
 * @file authSlice.js
 * @description Authentication Redux slice for managing user auth state
 * @module slices/authSlice
 * 
 * Manages authentication state including JWT token storage, signup data
 * for multi-step registration, and loading states. Handles token persistence
 * in localStorage with proper parsing for both quoted and unquoted formats.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? (localStorage.getItem("token").startsWith('"') ? JSON.parse(localStorage.getItem("token")) : localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;