import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, updateTask } from "@/store/reducers/taskSlice";
import type { AppDispatch, RootState } from "@/store";
import { CheckCircle2, Circle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import type { Task } from "@/types/index";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
    if (priority === "high") {
        return (
            <Badge variant="destructive" className="gap-1 px-2 py-0.5 text-xs font-semibold">
                <AlertTriangle size={12} /> High
            </Badge>
        );
    }
    if (priority === "medium") {
        return (
            <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 gap-1 px-2 py-0.5 text-xs font-semibold" variant="outline">
                Medium
            </Badge>
        );
    }
    return (
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 gap-1 px-2 py-0.5 text-xs font-semibold" variant="outline">
            Low
        </Badge>
    );
}

export default function TaskTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, isLoading, error } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks(undefined));
    }, [dispatch]);

    const toggleCompletion = (task: Task) => {
        dispatch(updateTask({ id: task.id, isCompleted: !task.isCompleted }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 gap-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-muted-foreground">Loading tasks...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-destructive">
                Failed to load tasks.
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
                <Clock size={40} className="opacity-50" />
                <p className="text-sm">No tasks yet. Create your first one!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 text-center">Status</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>

                        <TableHead className="hidden sm:table-cell">Priority</TableHead>
                        <TableHead className="hidden lg:table-cell text-right">Deadline</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id} className="group cursor-pointer">
                            <TableCell className="text-center align-middle" onClick={() => toggleCompletion(task)}>
                                <div className="flex justify-center">
                                    {task.isCompleted ? (
                                        <CheckCircle2
                                            size={18}
                                            className="text-green-500"
                                        />
                                    ) : (
                                        <Circle
                                            size={18}
                                            className="text-muted-foreground group-hover:text-foreground transition-colors"
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span
                                        className={`font-medium ${task.isCompleted
                                            ? "line-through text-muted-foreground"
                                            : "text-foreground"
                                            }`}
                                    >
                                        {task.title}
                                    </span>
                                    {task.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant="secondary" className="font-normal text-xs">
                                    {task.category}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <PriorityBadge priority={task.priority} />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                                {new Date(task.deadline).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
