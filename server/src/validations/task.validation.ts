import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tasks } from "@/models/index";

export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) =>
    schema.min(3, { message: "Title must be at least 3 characters long" }),
  description: (schema) =>
    schema.max(500, { message: "Description cannot exceed 500 characters" }),
  category: (schema) => schema.min(1, { message: "Category is required" }),

  deadline: z
    .string()
    .datetime({ message: "Invalid deadline format. Use ISO date string." }),
  reminderAt: z.string().datetime().optional(),
});

export const createTaskValidation = insertTaskSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  isCompleted: true,
});

export const updateTaskValidation = createTaskValidation.partial().extend({
  isCompleted: z.boolean().optional(),
});

export const deleteTaskValidation = z.object({ id: z.number() });

export type CreateTaskBody = z.infer<typeof createTaskValidation>;
export type UpdateTaskBody = z.infer<typeof updateTaskValidation>;
export type DeleteTaskBody = z.infer<typeof deleteTaskValidation>;
