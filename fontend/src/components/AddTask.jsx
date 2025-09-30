import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ onAdd }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //backend
  const addTask = async () => {
    if (title.trim()) {
      try {
        await api.post("/tasks", {
          title: title,
          description: description || undefined, // chỉ gửi nếu có
        });
        toast.success(t("tasks.add_success", { title: title }));
        onAdd(); // reload lại list

        // reset form và đóng khung nhập
        setTitle("");
        setDescription("");
        setIsExpanded(false);
      } catch (error) {
        console.error("Lỗi xảy ra khi thêm nhiệm vụ mới", error);
        toast.error(t("errors.add_error"));
      }
    } else {
      toast.error(t("errors.title_required"));
    }
  };

  const handleSubmit = () => {
    if (title.trim()) {
      addTask();
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setIsExpanded(false);
  };

  const handleHeaderClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 animate-gradient-x ">
      <CardHeader className="cursor-pointer" onClick={handleHeaderClick}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t("common.add_task")}
          </div>
          <Plus
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-45" : ""
            }`}
          />
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder={t("motivational.title_quote")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full"
                autoFocus
              />
            </div>
            <div>
              <Input
                placeholder={t("motivational.description_quote")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={!title.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("common.add_task")}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AddTask;
