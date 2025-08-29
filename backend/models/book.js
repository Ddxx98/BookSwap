// models/Book.js
import mongoose from "mongoose";

const CONDITION = ['new', 'good', 'fair', 'poor'];

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: CONDITION,
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
