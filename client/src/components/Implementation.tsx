export default function Implementation() {
  return (
    <section id="implementation" className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Guide</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Project Setup</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Create a new Node.js project on Replit</li>
            <li>Install the required dependencies</li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Environment Setup</h3>
          <p className="text-gray-600 mb-2">Create a <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">.env</code> file with the following content:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
{`DATABASE_URL=postgresql://postgres:VESdxsdWvk2i2lYs@db.stlgpxmgvgvjoymcawdg.supabase.co:5432/postgres`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Database Connection</h3>
          <p className="text-gray-600 mb-2">The application connects to Supabase PostgreSQL using drizzle-orm.</p>
          <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
{`// server/db.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || "");
export const db = drizzle(sql);`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Schema Definition</h3>
          <p className="text-gray-600 mb-2">Define the tasks table schema using drizzle-orm:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
{`// shared/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const updateTaskSchema = createInsertSchema(tasks).partial().omit({
  id: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;`}
          </pre>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">API Routes Implementation</h3>
          <p className="text-gray-600 mb-2">Implementing the routes for CRUD operations:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
{`// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to create task" });
      }
    }
  });

  // Get all tasks
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  });

  // Update a task
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const taskData = updateTaskSchema.parse(req.body);
      
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.status(200).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        res.status(500).json({ error: "Failed to update task" });
      }
    }
  });

  // Delete a task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }

      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}`}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Storage Implementation</h3>
          <p className="text-gray-600 mb-2">Implement the storage layer for database operations:</p>
          <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
{`// server/storage.ts
import { tasks, type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createTask(task: InsertTask): Promise<Task>;
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  updateTask(id: number, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async updateTask(id: number, taskData: UpdateTask): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    
    return task;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();`}
          </pre>
        </div>
      </div>
    </section>
  );
}
