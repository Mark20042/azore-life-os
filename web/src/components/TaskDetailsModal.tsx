import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type, CalendarDays, Tag, AlertTriangle, Loader2 } from "lucide-react";
import type { Task } from "@/types";
import { useState, useEffect } from "react";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export default function TaskDetailsModal({ isOpen, onClose, task }: TaskDetailsModalProps) {
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const [isEditing, setIsEditing] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    useEffect(() => {
        if (task && isOpen) {
            setTitle(task.title);
            // format for datetime-local
            const d = new Date(task.deadline || task.createdAt);
            // Need YYYY-MM-DDThh:mm format
            const tzoffset = d.getTimezoneOffset() * 60000;
            const localISOTime = new Date(d.getTime() - tzoffset).toISOString().slice(0, 16);
            setDeadline(localISOTime);
            setCategory(task.category || "");
            setPriority(task.priority);
        } else {
            setIsEditing(false);
        }
    }, [task, isOpen]);

    if (!task) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const isoDeadline = new Date(deadline).toISOString();

        updateTask.mutate({
            id: task.id,
            title,
            deadline: isoDeadline,
            category,
            priority
        }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask.mutate(task.id, {
                onSuccess: () => onClose()
            });
        }
    };

    const toggleCompletion = () => {
        updateTask.mutate({ id: task.id, isCompleted: !task.isCompleted });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center justify-between mt-2">
                        {isEditing ? "Edit Task" : "Task Details"}
                        {task.isCompleted && !isEditing && (
                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Completed</Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {!isEditing ? (
                    <div className="flex flex-col gap-5 py-4">
                        <div className="space-y-1">
                            <h3 className={`text-lg font-semibold ${task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                            </h3>
                            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Deadline</span>
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <CalendarDays size={16} className="text-muted-foreground" />
                                    {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Priority</span>
                                <div className="flex items-center text-sm">
                                    {task.priority === "high" && <Badge variant="destructive" className="gap-1 px-2 py-0.5 text-xs"><AlertTriangle size={12} /> High</Badge>}
                                    {task.priority === "medium" && <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs shadow-none">Medium</Badge>}
                                    {task.priority === "low" && <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs shadow-none">Low</Badge>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Category</span>
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <Tag size={16} className="text-muted-foreground" />
                                    {task.category}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-6 flex sm:justify-between items-center w-full">
                            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteTask.isPending}>
                                Delete
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    variant={task.isCompleted ? "outline" : "default"}
                                    size="sm"
                                    onClick={toggleCompletion}
                                    disabled={updateTask.isPending}
                                >
                                    {task.isCompleted ? "Mark Uncompleted" : "Mark Completed"}
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                                    Edit
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="flex flex-col gap-5 py-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-title" className="text-foreground">Task Title <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input id="edit-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="pl-9 h-11" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-deadline" className="text-foreground">Deadline <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input id="edit-deadline" type="datetime-local" required value={deadline} onChange={(e) => setDeadline(e.target.value)} className="pl-9 h-11" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-category" className="text-foreground">Category <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input id="edit-category" type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="pl-9 h-11" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-foreground">Priority</Label>
                            <div className="flex gap-2 mt-1">
                                {(["low", "medium", "high"] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${priority === p
                                            ? p === "high" ? "bg-destructive/10 border-destructive/30 text-destructive"
                                                : p === "medium" ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                                                    : "bg-green-500/10 border-green-500/30 text-green-500"
                                            : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit" disabled={updateTask.isPending}>
                                {updateTask.isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
