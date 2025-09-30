import express from "express";
import tasksRouters from "./Routes/tasksRouters.js";
import authRoutes from "./Routes/auth.js"; // Import auth routes
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
const port = process.env.PORT || 3000;
dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

// Thêm auth routes
app.use("/api/auth", authRoutes);

// Tasks routes
app.use("/api/tasks", tasksRouters);

//deloy
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../fontend/dist")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../fontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(port, () => console.log("Server đang hoạt động ở cổng 3000"));
});
