import express from "express";
import bookController from "../controllers/book.js";
import { verifyTokenMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.post("/book", verifyTokenMiddleware, bookController.createBook);
router.get("/books", bookController.getAllBooks);
router.get("/books/mine", verifyTokenMiddleware, bookController.getMyBooks);
router.put("/book/:id", verifyTokenMiddleware, bookController.updateBook);
router.patch("/book/:id", verifyTokenMiddleware, bookController.updateBook);
router.delete("/book/:id", verifyTokenMiddleware, bookController.deleteBook);

export default router;