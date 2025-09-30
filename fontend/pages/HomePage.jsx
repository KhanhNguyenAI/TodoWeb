import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import AddTask from "@/components/AddTask";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import api from "@/lib/axios";
import "@/lib/i18n"; // Import cấu hình i18n

import { useAuth } from "../contexts/AuthContext"; // Thêm import

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  const [tasks, setTasks] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);

  // 🔍 DEBUG: Log user changes
  useEffect(() => {
    console.log("🔄 User changed:", user?.email);
    console.log("📝 Current tasks state:", tasks.length);
  }, [user]);

  // Reset tasks khi user thay đổi
  useEffect(() => {
    if (!user) {
      // Reset state khi logout
      console.log("🚪 Logout - Resetting tasks state");
      setTasks([]);
      setActiveTaskCount(0);
      setCompleteTaskCount(0);
    } else {
      // Fetch tasks mới khi login
      console.log("🔐 Login - Fetching new tasks for user:", user.email);
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      console.log("📡 Fetching tasks for user:", user?.email);

      // Thêm cache busting
      const timestamp = new Date().getTime();
      const res = await api.get(`/tasks?t=${timestamp}`);

      console.log("✅ Tasks received:", res.data.tasks);
      console.log(
        "👤 Tasks belong to user:",
        res.data.tasks?.every((task) => task.user === user?.id)
      );

      setTasks(res.data.tasks || []);
      setActiveTaskCount(res.data.activeTaskCount || 0);
      setCompleteTaskCount(res.data.completeTaskCount || 0);
    } catch (error) {
      console.error("❌ Lỗi xảy ra khi truy xuất:", error);
      toast.error(t("errors.fetch_error"));
    }
  };

  // Các hàm xử lý khác...
  const handleTask = () => {
    fetchTasks();
  };

  const handleToggleTask = () => {
    fetchTasks();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const filterByDate = (task) => {
    const taskDate = new Date(task.createdAt);
    const now = new Date();

    switch (dateFilter) {
      case "today":
        return taskDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return taskDate >= weekAgo;
      case "month":
        return (
          taskDate.getMonth() === now.getMonth() &&
          taskDate.getFullYear() === now.getFullYear()
        );
      default:
        return true;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.status === "complete") ||
      (statusFilter === "pending" && task.status === "active");
    const dateMatch = filterByDate(task);
    return statusMatch && dateMatch;
  });

  const stats = {
    total: tasks.length,
    completed: completeTaskCount,
    pending: activeTaskCount,
  };

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Hiển thị khi chưa login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Header
            onLanguageChange={changeLanguage}
            currentLanguage={i18n.language}
          />

          {/* Welcome message cho người chưa login */}
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("common.welcome_guest")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("common.login_to_continue")}
              </p>
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  {t("common.login")}
                </a>
                <a
                  href="/register"
                  className="block w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                  {t("common.register")}
                </a>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  // Hiển thị todo app khi đã login
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header
          onLanguageChange={changeLanguage}
          currentLanguage={i18n.language}
        />

        {/* 🔍 Debug info - có thể xóa sau */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>User: {user.email}</p>
          <p>Tasks count: {tasks.length}</p>
          <p>User ID: {user.id}</p>
        </div>

        <AddTask onAdd={handleTask} />
        <StatsAndFilters
          stats={stats}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
        <TaskList
          tasks={currentTasks}
          onToggle={handleToggleTask}
          onDelete={handleTask}
          onUpdate={handleTask}
        />
        <TaskListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
