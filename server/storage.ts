import { tasks1 as tasks, users, type Task, type InsertTask, type UpdateTask, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  createTask(task: InsertTask, userId: number): Promise<Task>;
  getAllTasks(userId: number): Promise<Task[]>;
  getTask(id: number, userId: number): Promise<Task | undefined>;
  updateTask(id: number, task: UpdateTask, userId: number): Promise<Task | undefined>;
  deleteTask(id: number, userId: number): Promise<boolean>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async createTask(taskData: InsertTask, userId: number): Promise<Task> {
    const [task] = await db.insert(tasks).values({ 
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'pending',
      userId: userId 
    }).returning();
    return task;
  }

  async getAllTasks(userId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: number, userId: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks)
      .where(and(
        eq(tasks.id, id),
        eq(tasks.userId, userId)
      ));
    return task;
  }

  async updateTask(id: number, taskData: UpdateTask, userId: number): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(taskData)
      .where(and(
        eq(tasks.id, id),
        eq(tasks.userId, userId)
      ))
      .returning();

    return task;
  }

  async deleteTask(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(
        eq(tasks.id, id),
        eq(tasks.userId, userId)
      ))
      .returning({ id: tasks.id });

    return result.length > 0;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();