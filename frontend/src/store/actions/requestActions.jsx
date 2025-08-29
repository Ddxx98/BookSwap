import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create a new request for a book
export const createRequest = createAsyncThunk(
  "requests/createRequest",
  async ({ bookId, note }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE}/requests`,
        { bookId, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Expect { request }
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to create request";
      return rejectWithValue(msg);
    }
  }
);

// Requests initiated by the current user
export const fetchMyRequests = createAsyncThunk(
  "requests/fetchMyRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/requests/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Expect { requests: [...] }
      return data || [];
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch my requests";
      return rejectWithValue(msg);
    }
  }
);

// Requests received for the current user's books
export const fetchIncomingRequests = createAsyncThunk(
  "requests/fetchIncomingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/requests/incoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Expect { requests: [...] }
      return data || [];
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch incoming requests";
      return rejectWithValue(msg);
    }
  }
);

// Update request status (accept/decline/cancel)
export const updateRequestStatus = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${API_BASE}/requests/${id}`,
        { status }, // e.g., "pending" | "accepted" | "declined" | "cancelled"
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Expect { request }
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to update request";
      return rejectWithValue(msg);
    }
  }
);
