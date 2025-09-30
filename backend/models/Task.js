// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "complete"],
      default: "active",
    },
    user: {
      // ✅ THÊM FIELD USER
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completeAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
