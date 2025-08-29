import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import bookRoute from "./routes/book.js";
import requestRoute from "./routes/request.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", bookRoute);
app.use("/api", requestRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong.' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });