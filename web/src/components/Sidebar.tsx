import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  CalendarDays,
  ListTodo,
  Plus,
  Settings,
} from "lucide-react";

interface SidebarProps {
  onAddTask: () => void;
}

export default function Sidebar({ onAddTask }: SidebarProps) {
  const { data: user } = useAuthSession();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Calendar", icon: CalendarDays, href: "/dashboard?view=calendar" },
    { label: "Tasks", icon: ListTodo, href: "/dashboard?view=tasks" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-divider bg-default-50/50 hidden lg:flex flex-col h-full">
      {/* Add Task button */}
      <div className="px-4 mt-4">
        <Button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 h-10 shadow-md shadow-primary/25"
        >
          <Plus size={18} /> New Task
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-5 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname + location.search === item.href ||
            (item.href === "/dashboard" &&
              location.pathname === "/dashboard" &&
              !location.search);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-default-500 hover:bg-default-100 hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-divider">
        <Link
          to="/dashboard?view=settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-default-500 hover:bg-default-100 hover:text-foreground transition-all no-underline"
        >
          <Settings size={18} /> Settings
        </Link>
      </div>
    </aside>
  );
}
