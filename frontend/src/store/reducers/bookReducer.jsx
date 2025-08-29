// src/store/bookReducer.js
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { fetchBooks, fetchMyBooks, createBook, updateBook, deleteBook } from "../actions/bookActions";

const booksAdapter = createEntityAdapter({
  selectId: (book) => book._id || book.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const initialState = booksAdapter.getInitialState({
  loading: false,
  error: null,
  myLoading: false,
  myError: null,
  lastFetchedAt: null,
});

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearBooksError(state) {
      state.error = null;
      state.myError = null;
    },
    upsertLocalBook: booksAdapter.upsertOne, // optional helper for optimistic UI
  },
  extraReducers: (builder) => {
    // fetch all
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, { payload }) => {
        state.loading = false;
        booksAdapter.setAll(state, payload);
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchBooks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // fetch mine
    builder
      .addCase(fetchMyBooks.pending, (state) => {
        state.myLoading = true;
        state.myError = null;
      })
      .addCase(fetchMyBooks.fulfilled, (state, { payload }) => {
        state.myLoading = false;
        // Merge user's books into the same collection (single source of truth)
        booksAdapter.upsertMany(state, payload);
      })
      .addCase(fetchMyBooks.rejected, (state, { payload }) => {
        state.myLoading = false;
        state.myError = payload;
      });

    // create
    builder
      .addCase(createBook.pending, (state) => {
        // optionally set a flag or leave it to UI local state
      })
      .addCase(createBook.fulfilled, (state, { payload }) => {
        booksAdapter.addOne(state, payload);
      })
      .addCase(createBook.rejected, (state, { payload }) => {
        state.error = payload;
      });

    // update
    builder
      .addCase(updateBook.fulfilled, (state, { payload }) => {
        const id = payload._id || payload.id;
        booksAdapter.upsertOne(state, payload);
      })
      .addCase(updateBook.rejected, (state, { payload }) => {
        state.error = payload;
      });

    // delete
    builder
      .addCase(deleteBook.fulfilled, (state, { payload: id }) => {
        booksAdapter.removeOne(state, id);
      })
      .addCase(deleteBook.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearBooksError, upsertLocalBook } = booksSlice.actions;
export default booksSlice.reducer;

// Selectors
export const {
  selectAll: selectAllBooks,
  selectById: selectBookById,
  selectIds: selectBookIds,
  selectEntities: selectBookEntities,
} = booksAdapter.getSelectors((state) => state.books);
