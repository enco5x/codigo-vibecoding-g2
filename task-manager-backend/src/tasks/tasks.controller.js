import { tasksService } from "./tasks.service.js";

export const tasksController = {
  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await tasksService.getAll(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error getting tasks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const task = await tasksService.getById(id, userId);

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      console.error("Error getting task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async create(req, res) {
    try {
      const { title, description } = req.body;
      const userId = req.user?.id;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const newTask = await tasksService.create({ title, description }, userId);
      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      if (error.message.includes("required") || error.message.includes("characters")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      const userId = req.user.id;

      const updatedTask = await tasksService.update(id, { title, description, completed }, userId);

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      if (error.message.includes("cannot be empty") || error.message.includes("characters") || error.message.includes("Unauthorized")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const deleted = await tasksService.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};