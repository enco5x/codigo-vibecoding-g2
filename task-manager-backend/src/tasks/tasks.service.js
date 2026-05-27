import { prisma } from "../config/db.js";

export const tasksService = {
  async getAll(userId) {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  async getById(id, userId) {
    const task = await prisma.task.findUnique({
      where: { id }
    });
    if (!task || task.userId !== userId) {
      return null;
    }
    return task;
  },

  async create(taskData, userId) {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (taskData.title.length > 255) {
      throw new Error("Title must be at most 255 characters");
    }
    if (taskData.description && taskData.description.length > 1000) {
      throw new Error("Description must be at most 1000 characters");
    }

    return await prisma.task.create({
      data: {
        title: taskData.title.trim(),
        description: taskData.description?.trim() || null,
        completed: false,
        userId
      }
    });
  },

  async update(id, taskData, userId) {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return null;
    }

    if (existingTask.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (taskData.title !== undefined) {
      if (taskData.title.trim().length === 0) {
        throw new Error("Title cannot be empty");
      }
      if (taskData.title.length > 255) {
        throw new Error("Title must be at most 255 characters");
      }
    }
    if (taskData.description !== undefined && taskData.description.length > 1000) {
      throw new Error("Description must be at most 1000 characters");
    }

    return await prisma.task.update({
      where: { id },
      data: {
        ...(taskData.title && { title: taskData.title.trim() }),
        ...(taskData.description !== undefined && { description: taskData.description?.trim() || null }),
        ...(taskData.completed !== undefined && { completed: taskData.completed })
      }
    });
  },

  async delete(id, userId) {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return false;
    }

    if (existingTask.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.task.delete({ where: { id } });
    return true;
  }
};