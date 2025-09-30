import Task from "../models/Task.js";

// GET /api/tasks - Lấy tất cả tasks CỦA USER HIỆN TẠI
export const getAlltasks = async (req, res) => {
  try {
    console.log("🔍 ===== GET TASKS DEBUG =====");
    console.log("🔍 User ID:", req.userId);
    console.log("🔍 User ID type:", typeof req.userId);

    // ✅ FIX: Convert string to ObjectId
    const mongoose = await import("mongoose");
    const userId = new mongoose.Types.ObjectId(req.userId);

    console.log("🔍 Converted User ID:", userId);

    const result = await Task.aggregate([
      {
        $match: { user: userId }, // ✅ DÙNG ObjectId
      },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeTaskCount: [
            { $match: { status: "active" } },
            { $count: "count" },
          ],
          completeTaskCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    console.log("🔍 Raw aggregation result:", JSON.stringify(result, null, 2));

    const tasks = result[0]?.tasks || [];
    const activeTaskCount = result[0]?.activeTaskCount[0]?.count || 0;
    const completeTaskCount = result[0]?.completeTaskCount[0]?.count || 0;

    console.log("📦 Backend - Tasks found:", tasks.length);
    console.log("🔍 ===== END DEBUG =====");

    res.status(200).json({
      tasks,
      activeTaskCount,
      completeTaskCount,
    });
  } catch (error) {
    console.log("get task error", error);
    res.status(500).json({ message: "internal server error" });
  }
};
// POST /api/tasks - Tạo task MỚI CHO USER HIỆN TẠI
// POST /api/tasks - Tạo task MỚI CHO USER HIỆN TẠI
export const createTasks = async (req, res) => {
  try {
    const { title, description } = req.body;

    // 🔍 THÊM DEBUG LOGS QUAN TRỌNG
    console.log("🛠️ ===== CREATE TASK DEBUG =====");
    console.log("🛠️ User ID from auth:", req.userId);
    console.log("🛠️ Request body:", { title, description });
    console.log("🛠️ Headers:", req.headers);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title,
      description: description || "",
      user: req.userId, // THÊM user ID vào task
    });

    console.log("🛠️ Task object before save:", newTask);

    await newTask.save();

    console.log("✅ Task created successfully:", newTask);
    console.log("🛠️ ===== END DEBUG =====");

    res.status(201).json(newTask);
  } catch (error) {
    console.log("❌ create task error", error);
    res.status(500).json({ message: "internal server error" });
  }
};
// PUT /api/tasks/:id - Update task (CHỈ CỦA USER HIỆN TẠI)
export const updateTasks = async (req, res) => {
  try {
    const { title, description, status, completeAt } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (completeAt !== undefined) updateData.completeAt = completeAt;

    // Tìm và update task, ĐẢM BẢO nó thuộc về user hiện tại
    const updateTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId, // CHỈ update task của user hiện tại
      },
      updateData,
      { new: true }
    );

    if (!updateTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.log("update task error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// DELETE /api/tasks/:id - Delete task (CHỈ CỦA USER HIỆN TẠI)
export const deleteTasks = async (req, res) => {
  try {
    // CHỈ delete task của user hiện tại
    const deleteTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleteTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.log("delete task error", error);
    res.status(500).json({ message: "internal server error" });
  }
};
