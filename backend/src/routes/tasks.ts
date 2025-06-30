import { Router } from "express";
import * as tasksController from "../controllers/tasks";
import { validateJWT, validateRole } from "../middlewares/auth";
import { UserRole } from "../models/user";
import { validateCreateTaskRequest, validateUpdateTaskRequest, validateGetTaskByIdRequest } from "../middlewares/validations";


const tasksRouter = Router();

tasksRouter.route("/tasks")
  .get(
    validateJWT,
    tasksController.listTasks
  )
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
