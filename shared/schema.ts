
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks1 = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

// Schemas for users
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

// Schemas for tasks
export const insertTaskSchema = createInsertSchema(tasks1).omit({
  id: true,
});

export const updateTaskSchema = createInsertSchema(tasks1).partial().omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks1.$inferSelect;
