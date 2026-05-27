import express from "express";
import { tasksController } from "./tasks.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

router.get("/", asyncHandler(tasksController.getAll));
router.get("/:id", asyncHandler(tasksController.getById));
router.post("/", asyncHandler(tasksController.create));
router.put("/:id", asyncHandler(tasksController.update));
router.delete("/:id", asyncHandler(tasksController.delete));

export default router;