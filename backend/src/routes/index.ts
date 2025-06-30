import express from "express";
import authRouter from "./auth";
import offerRouter from "./offers";
import skillsRouter from "./skills";
import taskProgressRouter from "./task_progress";
import tasksRouter from "./tasks";

const router = express.Router();

const basePath = "/api/v1";

router.use(
  basePath,
  authRouter,
  offerRouter,
  skillsRouter,
  taskProgressRouter,
  tasksRouter,
);

export default router;
