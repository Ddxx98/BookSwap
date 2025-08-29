import Request from "../models/request.js";
import Book from "../models/book.js";

const createRequest = async (req, res, next) => {
    const { bookId, note } = req.body;
    const fromUserId = req.user.userId;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        const request = await Request.create({ bookId, fromUserId, toUserId: book.owner, note });
        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};

const getMyRequests = async (req, res, next) => {
    const userId = req.user.userId;
    try {
        const requests = await Request.find({ fromUserId: userId });
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

const getIncomingRequests = async (req, res, next) => {
    const userId = req.user.userId;
    try {
        const requests = await Request.find({ toUserId: userId, status: "pending" });
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

const updateRequestStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const request = await Request.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

export default {
    createRequest,
    getMyRequests,
    getIncomingRequests,
    updateRequestStatus
};
