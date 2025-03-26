import type { Express } from "express";
import { createServer, type Server } from "http";
import { authMiddleware, type AuthRequest } from "./middleware/auth";
import authRoutes from "./routes/auth";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new task
  app.use('/auth', authRoutes);
  
  app.post("/api/tasks", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: fromZodError(error).message });
      } else {
        console.error("Create task error:", error);
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
      console.error("Get tasks error:", error);
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
        console.error("Update task error:", error);
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
      console.error("Delete task error:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
