import type { Request, Response } from "express";
import * as taskProgressModel from "../models/task_progress";

export const updateTaskProgress = async (req: Request, res: Response) => {
  try {
    const progress = await taskProgressModel.updateTaskProgress(req.body);
    res.status(201).json(progress);
  } catch (e) {
    res.status(400).json({ error: "Update task progress failed", details: e });
  }
};
