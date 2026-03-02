import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "@/models/index";

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(3, "Name must be at least 3 characters"),
  email: (schema) => schema.email("Invalid email address"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
});

export const registerUserValidation = insertUserSchema.omit({
  id: true,
  createdAt: true,
});

export const loginValidation = insertUserSchema.pick({
  email: true,
  password: true,
});

export type LoginBody = z.infer<typeof loginValidation>;

export type RegisterBody = z.infer<typeof registerUserValidation>;
