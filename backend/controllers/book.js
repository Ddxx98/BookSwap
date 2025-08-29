import Book from "../models/book.js";

// POST /books
export const createBook = async (req, res) => {
  try {
    const { title, author, description, imageUrl, condition } = req.body;
    const userId = req.user.userId;
    const newBook = new Book({ title, author, description, imageUrl, condition, owner: userId });
    await newBook.save();
    return res.status(201).json({ message: "Book created successfully.", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /books?page=1&limit=20
export const getAllBooks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v") // omit internal fields
        .lean(),
      Book.countDocuments({}),
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /books/mine
export const getMyBooks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const books = await Book.find({ owner: userId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    return res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching my books:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /books/:id
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, imageUrl, condition } = req.body;
    const userId = req.user.userId;

    // Check ownership first
    const existing = await Book.findById(req.params.id).select("owner").lean();
    if (!existing) return res.status(404).json({ message: "Book not found." });
    if (String(existing.owner) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to update this book." });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, imageUrl, condition },
      { new: true, runValidators: true, context: "query" }
    ).select("-__v");

    return res.status(200).json({ message: "Book updated successfully.", book });
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /books/:id
export const deleteBook = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check ownership
    const existing = await Book.findById(req.params.id).select("owner").lean();
    if (!existing) return res.status(404).json({ message: "Book not found." });
    if (String(existing.owner) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this book." });
    }

    await Book.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export default { createBook, getAllBooks, getMyBooks, updateBook, deleteBook };
