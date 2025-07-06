import express from "express";
import authRouter from "./auth";
import offerRouter from "./offers";
import skillsRouter from "./skills";
import tasksRouter from "./tasks";

const router = express.Router();

const basePath = "/api/v1";

router.use(basePath, authRouter, offerRouter, skillsRouter, tasksRouter);

export default router;
