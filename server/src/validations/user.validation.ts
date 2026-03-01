import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "@/models/index";

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(3, "Name must be at least 3 characters"),
  email: (schema) => schema.email("Invalid email address"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
});

export const createUserValidation = insertUserSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateUserBody = z.infer<typeof createUserValidation>;
