import React from "react";
import { useTranslation } from "react-i18next";
import { Filter, Check } from "lucide-react";
import { Button } from "./ui/button";
import DateTimeFilter from "./DatetTimeFilter.jsx";
import { Card, CardContent } from "./ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const StatsAndFilters = ({
  stats,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
}) => {
  const { t } = useTranslation();

  const getStatusFilterLabel = () => {
    switch (statusFilter) {
      case "all":
        return t("filters.all");
      case "completed":
        return t("filters.completed");
      case "pending":
        return t("filters.pending");
      default:
        return t("filters.all");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Stats Section */}
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">{t("stats.total")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600">
                {t("stats.completed")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">{t("stats.pending")}</div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex gap-2 flex-wrap">
            <DateTimeFilter
              currentFilter={dateFilter}
              onFilterChange={onDateFilterChange}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {getStatusFilterLabel()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  <button
                    onClick={() => onStatusChange("all")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center gap-2 ${
                      statusFilter === "all" ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 ${
                        statusFilter === "all" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {t("filters.all")}
                  </button>
                  <button
                    onClick={() => onStatusChange("pending")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center gap-2 ${
                      statusFilter === "pending"
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 ${
                        statusFilter === "pending" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {t("filters.pending")}
                  </button>
                  <button
                    onClick={() => onStatusChange("completed")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center gap-2 ${
                      statusFilter === "completed"
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 ${
                        statusFilter === "completed"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {t("filters.completed")}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsAndFilters;
