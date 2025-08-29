import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/register`, {
        username,
        email,
        password,
      });
      // Expect { user, token }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Registration failed";
      return rejectWithValue(msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });
      // Expect { user, token }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token");
      const { data } = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      return { user: data.user, token };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to load user";
      return rejectWithValue(msg);
    }
  }
);
