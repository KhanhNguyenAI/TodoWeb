// Routes/tasksRouters.js
import express from "express";
import {
  getAlltasks,
  createTasks,
  updateTasks,
  deleteTasks,
} from "../controllers/tasksControllers.js";
import auth from "../middleware/auth.js"; // ✅ THÊM DÒNG NÀY

const router = express.Router();

// Route Home - THÊM auth middleware
router.get("/", auth, getAlltasks); // ✅
router.post("/", auth, createTasks); // ✅
router.put("/:id", auth, updateTasks); // ✅
router.delete("/:id", auth, deleteTasks); // ✅

export default router;
