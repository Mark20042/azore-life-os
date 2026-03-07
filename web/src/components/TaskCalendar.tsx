import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "@/store/reducers/taskSlice";
import type { AppDispatch, RootState } from "@/store";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  addDays,
} from "date-fns";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import TaskDetailsModal from "./TaskDetailsModal";
import type { Task } from "@/types";

type ViewType = "month" | "week" | "day" | "agenda";

export default function TaskCalendar() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks(undefined));
  }, [dispatch]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // --- MONTH VIEW MATH ---
  const daysInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const getTasksForDay = (day: Date) => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      if (task.isCompleted) return false;
      const taskDate = task.deadline
        ? new Date(task.deadline)
        : new Date(task.createdAt);
      return isSameDay(taskDate, day);
    });
  };


  const listTasks = useMemo(() => {
    if (!tasks || view === "month") return [];

    const filtered = tasks.filter((task) => {
      if (task.isCompleted) return false;
      const taskDate = task.deadline
        ? new Date(task.deadline)
        : new Date(task.createdAt);

      if (view === "day") return isSameDay(taskDate, currentDate);
      if (view === "week") {
        return isWithinInterval(taskDate, {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
        });
      }
      if (view === "agenda") {
        // Agenda shows upcoming tasks for the next 30 days
        return isWithinInterval(taskDate, {
          start: currentDate,
          end: addDays(currentDate, 30),
        });
      }
      return false;
    });

    // Sort them chronologically!
    return filtered.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline) : new Date(a.createdAt);
      const dateB = b.deadline ? new Date(b.deadline) : new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  }, [tasks, view, currentDate]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="text-default-500">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-danger">
        <p>Failed to load tasks.</p>
      </div>
    );
  }

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="flex flex-col h-full w-full task-calendar-container bg-white  p-4 font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="px-2 py-1.5 hover:bg-gray-50 border-r"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="px-2 py-1.5 hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-800">
          {view === "day"
            ? format(currentDate, "MMMM d, yyyy")
            : format(currentDate, "MMMM yyyy")}
        </h2>

        {/* View Switcher Controls */}
        <div className="flex border rounded-md overflow-hidden text-sm font-medium">
          {(["month", "week", "day", "agenda"] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 capitalize transition-colors ${view === v
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
                } ${v !== "agenda" ? "border-r" : ""}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "month" ? (
        // --- MONTH GRID ---
        <div className="flex-1  overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-7 border-b bg-gray-50 shrink-0">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div
            className="grid grid-cols-7 flex-1 bg-gray-200 gap-px min-h-0"
            style={{
              gridTemplateRows: `repeat(${daysInMonth.length / 7}, minmax(0, 1fr))`,
            }}
          >
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={`flex flex-col bg-white transition-colors overflow-hidden min-h-0 ${!isCurrentMonth ? "bg-gray-50/50" : ""
                    }`}
                >
                  <div className="sticky top-0 z-10 flex justify-end p-1.5 bg-inherit shrink-0">
                    <span
                      className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday
                        ? "bg-primary text-white"
                        : !isCurrentMonth
                          ? "text-gray-400"
                          : "text-gray-700"
                        }`}
                    >
                      {format(day, "dd")}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar px-1.5 pb-1.5 flex flex-col gap-1 min-h-0">
                    {dayTasks.map((task) => {
                      let bgColor = "var(--primary)";
                      if (task.priority === "high")
                        bgColor = "var(--destructive)";
                      else if (task.priority === "medium") bgColor = "#f97316";

                      const taskDate = task.deadline
                        ? new Date(task.deadline)
                        : new Date(task.createdAt);
                      const hoverText = `${format(taskDate, "h:mm a")} - ${task.title}`;

                      return (
                        <button
                          key={task.id}
                          title={hoverText}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-left w-full text-xs text-white px-1.5 py-1 rounded-[4px] truncate transition-opacity hover:opacity-80 shrink-0"
                          style={{ backgroundColor: bgColor }}
                        >
                          <div className="font-semibold truncate text-[11px] leading-tight">
                            {task.title}
                          </div>
                          <div className="opacity-80 truncate hidden xl:block text-[9px] mt-0.5">
                            {task.category}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // --- AGENDA / LIST VIEW ---
        <div className="flex-1 overflow-y-auto custom-scrollbar border rounded-lg p-4 bg-gray-50/50 min-h-0">
          {listTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <CalendarIcon size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">
                No tasks found for this {view}.
              </p>
              <p className="text-sm">Enjoy your free time!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listTasks.map((task) => {
                let badgeColor = "bg-primary/10 text-primary";
                let dotColor = "bg-primary";
                if (task.priority === "high") {
                  badgeColor = "bg-destructive/10 text-destructive";
                  dotColor = "bg-destructive";
                } else if (task.priority === "medium") {
                  badgeColor = "bg-orange-500/10 text-orange-600";
                  dotColor = "bg-orange-500";
                }

                const taskDate = task.deadline
                  ? new Date(task.deadline)
                  : new Date(task.createdAt);

                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailsModalOpen(true);
                    }}
                    className="flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    {/* MAGIC FIX 2: Widened container (w-28), smaller text, and whitespace-nowrap so AM/PM never drops to a new line! */}
                    <div className="flex flex-col items-start justify-center w-28 shrink-0 border-r pr-4">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {format(taskDate, "MMM dd")}
                      </span>
                      <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                        <Clock size={13} className="opacity-50 shrink-0" />
                        {format(taskDate, "h:mm a")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pl-4">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {task.category}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${badgeColor}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                        ></span>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setTimeout(() => setSelectedTask(null), 200);
        }}
        task={selectedTask}
      />
    </div>
  );
}
