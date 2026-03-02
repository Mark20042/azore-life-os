import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "@/models/users";
import e from "express";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  userId: serial("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
