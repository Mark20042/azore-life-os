import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "@/store/reducers/taskSlice";
import type { AppDispatch, RootState } from "@/store";
import { CalendarDays, Tag, Type, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.tasks);

    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !deadline || !category) return;

        // Convert datetime-local value to proper ISO 8601 string
        // datetime-local gives "2026-03-10T14:30" but the backend expects "2026-03-10T14:30:00.000Z"
        const isoDeadline = new Date(deadline).toISOString();

        const resultAction = await dispatch(createTask({ title, deadline: isoDeadline, category, priority }));

        if (createTask.fulfilled.match(resultAction)) {
            setTitle("");
            setDeadline("");
            setCategory("");
            setPriority("medium");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="task-title" className="text-foreground">
                            Task Title <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                id="task-title"
                                type="text"
                                required
                                autoFocus
                                placeholder="e.g. Finish project proposal"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="pl-9 h-11"
                            />
                        </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="task-deadline" className="text-foreground">
                            Deadline <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                id="task-deadline"
                                type="datetime-local"
                                required
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="pl-9 h-11"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="task-category" className="text-foreground">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                id="task-category"
                                type="text"
                                required
                                placeholder="e.g. Work, Personal, Study"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="pl-9 h-11"
                            />
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-foreground">
                            <span className="flex items-center gap-1.5">
                                <Flag size={14} className="text-muted-foreground" /> Priority
                            </span>
                        </Label>
                        <div className="flex gap-2 mt-1">
                            {(["low", "medium", "high"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${priority === p
                                        ? p === "high"
                                            ? "bg-destructive/10 border-destructive/30 text-destructive"
                                            : p === "medium"
                                                ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
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
                        <Button variant="ghost" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
