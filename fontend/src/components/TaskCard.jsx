import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
  Save,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useTranslation } from "react-i18next";

const TaskCard = ({ task, onToggle, onDelete, onUpdate }) => {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || "",
  });

  const deleteTasks = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success(t("tasks.delete_success"));
      onDelete();
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất:", error);
      toast.error(t("errors.delete_error"));
    }
  };

  /// complete or not
  /// toggle : completed or active
  const toggleComplete = async () => {
    try {
      const newStatus = task.status === "active" ? "complete" : "active";
      const updateData = {
        status: newStatus,
      };

      // Chỉ thêm completeAt nếu chuyển sang trạng thái complete
      if (newStatus === "complete") {
        updateData.completeAt = new Date().toISOString();
      } else {
        // Nếu chuyển từ complete về active, xóa completeAt
        updateData.completeAt = null;
      }

      await api.put(`/tasks/${task._id}`, updateData);

      if (newStatus === "complete") {
        toast.success(t("tasks.complete_success", { title: task.title }));
      } else {
        toast.success(t("tasks.incomplete_success", { title: task.title }));
      }

      onToggle();
    } catch (error) {
      console.error("Lỗi xảy ra lúc bấm hoàn thành nhiệm vụ", error);
      toast.error(t("errors.toggle_error"));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({
      title: task.title,
      description: task.description || "",
    });
  };

  const handleSave = async () => {
    try {
      if (!editedTask.title.trim()) {
        toast.error(t("errors.title_required"));
        return;
      }

      await api.put(`/tasks/${task._id}`, {
        title: editedTask.title,
        description: editedTask.description,
      });

      toast.success(t("tasks.update_success"));
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật:", error);
      toast.error(t("errors.update_error"));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({
      title: task.title,
      description: task.description || "",
    });
  };

  const handleInputChange = (field, value) => {
    setEditedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm format date theo ngôn ngữ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      i18n.language === "vi"
        ? "vi-VN"
        : i18n.language === "ja"
        ? "ja-JP"
        : "en-US"
    );
  };

  const getStatusText = () => {
    return task.status === "complete"
      ? t("tasks.completed")
      : t("tasks.active");
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        task.status === "complete" ? "bg-gray-50" : ""
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleComplete()}
            className="mt-1 focus:outline-none"
            disabled={isEditing}
          >
            {task.status === "complete" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editedTask.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={t("tasks.title_placeholder")}
                  className="font-semibold"
                />
                <Textarea
                  value={editedTask.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={t("tasks.description_placeholder")}
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h3
                  className={`font-semibold ${
                    task.status === "complete"
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`text-sm mt-1 ${
                      task.status === "complete"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </>
            )}

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={task.status === "complete" ? "secondary" : "default"}
              >
                {getStatusText()}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.createdAt)}</span>
                {task.status === "complete" && task.completeAt && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>
                        {t("tasks.completed_at")}: {formatDate(task.completeAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <SquarePen className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTasks(task._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// TaskEmptyCard Component
const TaskEmptyCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Circle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("tasks.no_tasks")}
        </h3>
        <p className="text-gray-600 text-center">{t("tasks.add_first_task")}</p>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
