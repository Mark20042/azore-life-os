import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "@/models/users";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"), // Optional extra detail
  priority: priorityEnum("priority").default("medium").notNull(),
  category: text("category").default("general").notNull(), // e.g., "School", "Work"
  isCompleted: boolean("is_completed").default(false).notNull(),
  deadline: timestamp("deadline").notNull(),
  reminderAt: timestamp("reminder_at"), // When to alert the user
  userId: serial("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
