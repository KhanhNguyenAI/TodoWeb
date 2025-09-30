import * as React from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DateTimeFilter = ({ onFilterChange, currentFilter }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Định nghĩa filters với translation
  const filters = [
    { value: "all", label: t("filters.all_time") },
    { value: "today", label: t("filters.today") },
    { value: "week", label: t("filters.week") },
    { value: "month", label: t("filters.month") },
  ];

  const getCurrentFilterLabel = () => {
    const filter = filters.find((f) => f.value === currentFilter);
    return filter ? filter.label : t("filters.all_time");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Calendar className="w-4 h-4 mr-2" />
          {getCurrentFilterLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                onFilterChange(filter.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center gap-2 ${
                currentFilter === filter.value ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <Check
                className={`h-4 w-4 ${
                  currentFilter === filter.value ? "opacity-100" : "opacity-0"
                }`}
              />
              {filter.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimeFilter;
