// src/store/bookActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/books`);
      // Backend: { books: [...] }
      return data.books || [];
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch books";
      return rejectWithValue(msg);
    }
  }
);

export const fetchMyBooks = createAsyncThunk(
  "books/fetchMyBooks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/books/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend: { books: [...] }
      return data.books || [];
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch my books";
      return rejectWithValue(msg);
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async ({ title, author, condition, imageUrl, description }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE}/books`, // plural collection
        { title, author, condition, imageUrl, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend: { message, book }
      return data.book;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to create book";
      return rejectWithValue(msg);
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(`${API_BASE}/book/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend: { message, book }
      return data.book;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to update book";
      return rejectWithValue(msg);
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to delete book";
      return rejectWithValue(msg);
    }
  }
);
