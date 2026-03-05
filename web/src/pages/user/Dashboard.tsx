import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TaskCalendar from "@/components/TaskCalendar";
import TaskTable from "@/components/TaskTable";
import AddTaskModal from "@/components/AddTaskModal";
import { CalendarDays, ListTodo, Plus } from "lucide-react";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentView = searchParams.get("view") || "calendar";

  const setView = (view: string) => {
    setSearchParams({ view });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar onAddTask={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {currentView === "tasks" ? "All Tasks" : "Task Calendar"}
            </h1>
            <p className="text-default-500 text-sm mt-1">
              {currentView === "tasks"
                ? "View and manage all your tasks in one place."
                : "Visualize your deadlines on the calendar."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center bg-default-100 rounded-xl p-1">
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentView === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-default-500 hover:text-foreground"
                  }`}
              >
                <CalendarDays size={14} /> Calendar
              </button>
              <button
                onClick={() => setView("tasks")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentView === "tasks"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-default-500 hover:text-foreground"
                  }`}
              >
                <ListTodo size={14} /> Table
              </button>
            </div>

            {/* Mobile Add Task */}
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="lg:hidden flex items-center gap-1.5 shadow-md shadow-primary/25"
            >
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-background border border-divider rounded-2xl p-5 shadow-sm min-h-0">
          {currentView === "tasks" ? <TaskTable /> : <TaskCalendar />}
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
