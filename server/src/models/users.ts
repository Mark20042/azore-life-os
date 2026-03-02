import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//Drizzle has a built-in magic property called $inferSelect that automatically generates the perfect TypeScript interface based on your database columns
export type User = typeof users.$inferSelect;
