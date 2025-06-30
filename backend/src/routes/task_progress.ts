import { Router } from "express";
import * as taskProgressController from "../controllers/task_progress";

const taskProgressRouter = Router({ mergeParams: true });

taskProgressRouter
  .route("/task-progress")
  .post(taskProgressController.updateTaskProgress);

export default taskProgressRouter;
