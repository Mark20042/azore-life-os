import { Router } from "express";
import type { Router as RouterType } from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
} from "@/controllers/taks.controller";
import { authenticationMiddleware } from "@/middlewares/auth";
import { validateBody } from "@/middlewares/validator";
import {
  createTaskValidation,
  updateTaskValidation,
  deleteTaskValidation,
} from "@/validations/task.validation";

const router: RouterType = Router();

//  will require a valid 'accessToken' cookie
router.use(authenticationMiddleware);

// GET /dawg/tasks
router.get("/", getMyTasks);

// POST /dawg/tasks
router.post("/", validateBody(createTaskValidation), createTask);

// PATCH /dawg/tasks/:id
router.patch("/:id", validateBody(updateTaskValidation), updateTask);

// DELETE /dawg/tasks/:id
router.delete("/:id", validateBody(deleteTaskValidation), updateTask);

export default router;
