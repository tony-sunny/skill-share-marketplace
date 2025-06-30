import { Router } from "express";
import * as tasksController from "../controllers/tasks.js";
import { validateJWT, validateRole } from "../middlewares/auth.js";
import { UserRole } from "../models/user.js";
import { validateCreateTaskRequest, validateUpdateTaskRequest, validateGetTaskByIdRequest } from "../middlewares/validations.js";


const tasksRouter = Router();
// List all tasks

tasksRouter.route("/tasks")
  .get(tasksController.listTasks)
  .post(
    validateJWT,
    validateRole(UserRole.User),
    validateCreateTaskRequest(),
    tasksController.createTask
  );

tasksRouter.route("/tasks/:id")
  .get(
    validateGetTaskByIdRequest(),
    tasksController.getTaskById)
  .put(
    validateJWT,
    validateRole(UserRole.User),
    validateUpdateTaskRequest(),
    tasksController.updateTask
  );


export default tasksRouter;
