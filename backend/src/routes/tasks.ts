import { Router } from "express";
import * as tasksController from "../controllers/tasks";
import { authenticateReq, authenticateAndAuthorizeReq } from "../middlewares/auth";
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
  .get(authenticateReq, tasksController.listTasks)
  .post(
    authenticateAndAuthorizeReq(UserRole.User),
    validateCreateTaskRequest(),
    tasksController.createTask,
  );

tasksRouter
  .route("/tasks/:id")
  .get(validateGetTaskByIdRequest(), tasksController.getTaskById)
  .put(
    authenticateAndAuthorizeReq(UserRole.User),
    validateUpdateTaskRequest(),
    tasksController.updateTask,
  );

tasksRouter
  .route("/tasks/:id/progress")
  .patch(
    authenticateAndAuthorizeReq(UserRole.Provider),
    validateUpdateTaskProgressRequest(),
    tasksController.updateTaskProgress,
  );

export default tasksRouter;
