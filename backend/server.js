import express from "express";
import tasksRouters from "./Routes/tasksRouters.js";
import authRoutes from "./Routes/auth.js"; // Import auth routes
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

const port = process.env.PORT || 3000;
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Thêm auth routes
app.use("/api/auth", authRoutes);

// Tasks routes
app.use("/api/tasks", tasksRouters);

connectDB().then(() => {
  app.listen(port, () => console.log("Server đang hoạt động ở cổng 3000"));
});
