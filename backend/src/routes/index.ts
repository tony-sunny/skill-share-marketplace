import express from "express";
import authRouter from "./auth.js";
import offerRouter from "./offers.js";
import skillsRouter from "./skills.js";
import taskProgressRouter from "./task_progress.js";
import tasksRouter from "./tasks.js";

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
