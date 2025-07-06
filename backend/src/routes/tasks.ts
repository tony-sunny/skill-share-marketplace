import { Router } from "express";
import * as tasksController from "../controllers/tasks";
import { validateJWT, validateRole } from "../middlewares/auth";
import { UserRole } from "../models/user";
import {
  validateCreateTaskRequest,
  validateUpdateTaskRequest,
  validateGetTaskByIdRequest,
  validateUpdateTaskProgressRequest,
} from "../middlewares/validations";

const tasksRouter = Router();

tasksRouter
  .route("/tasks")
  .get(validateJWT, tasksController.listTasks)
  .post(
    validateJWT,
    validateRole(UserRole.User),
    validateCreateTaskRequest(),
    tasksController.createTask,
  );

tasksRouter
  .route("/tasks/:id")
  .get(validateGetTaskByIdRequest(), tasksController.getTaskById)
  .put(
    validateJWT,
    validateRole(UserRole.User),
    validateUpdateTaskRequest(),
    tasksController.updateTask,
  );

tasksRouter
  .route("/tasks/:id/progress")
  .patch(
    validateJWT,
    validateRole(UserRole.User),
    validateUpdateTaskProgressRequest(),
    tasksController.updateTaskProgress,
  );

export default tasksRouter;
