import React from "react";
import { Card, CardContent } from "./ui/card";
import { Circle } from "lucide-react";

const TaskEmptyState = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Circle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chưa có task nào
        </h3>
        <p className="text-gray-600 text-center">
          Thêm task đầu tiên để bắt đầu quản lý công việc của bạn
        </p>
      </CardContent>
    </Card>
  );
};

export default TaskEmptyState;
