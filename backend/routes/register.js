import express from "express";
import registerController from "../controllers/register.js";

const router = express.Router();

router.post("/register", registerController.register);

export default router;