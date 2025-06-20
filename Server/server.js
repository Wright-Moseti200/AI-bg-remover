import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("express app is running");
    console.log("express app is running");
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});