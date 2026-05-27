import express from "express";
import { usersController } from "./users.controller.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/register", asyncHandler(usersController.register));
router.post("/login", asyncHandler(usersController.login));

export default router;