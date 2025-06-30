import type { Request, Response } from "express";
import { constants } from "node:http2";

import * as taskModel from "../models/task";
import type { RequestWithSession } from "../middlewares/auth";

export const createTask = async (req: RequestWithSession, res: Response) => {
  try {
    const task = {
      ...req.body,
      user_id: req.session?.id,
      status: taskModel.TaskStatus.Open
    }
    await taskModel.createTask(task);
    res.status(constants.HTTP_STATUS_CREATED).end()
  } catch (e) {
     res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Create task failed", details: e });
  }
};

export const listTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      taskModel.listTasks({ offset, limit }),
      taskModel.countTasks()
    ]);
    const mappedTasks = tasks.map(task => ({
      id: task.id,
      category: task.category,
      name: task.name,
      description: task.description,
      expected_start_date: task.expected_start_date?.toISOString().split('T')[0],
      expected_hours: task.expected_hours,
      hourly_rate: task.hourly_rate,
      rate_currency: task.rate_currency,
      status: task.status
    }));
    res.status(constants.HTTP_STATUS_OK).json({
      tasks: mappedTasks,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "List tasks failed", details: e });
  }
};

export const updateTask = async (req: RequestWithSession, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    const task = await taskModel.getTaskById(taskId);
    if (!task) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ error: "Task not found" });
      return;
    }
    if (task.user_id !== req.session?.id) {
      res.status(constants.HTTP_STATUS_FORBIDDEN).json({ error: "You are not allowed to update this task" });
      return;
    }
    const updatedTask = await taskModel.updateTask(taskId, {...req.body, user_id: req.session?.id });
    res.status(constants.HTTP_STATUS_CREATED).json(updatedTask);
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Update task failed", details: e });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const task = await taskModel.getTaskById(id);
    if (!task) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ error: "Task not found" });
      return;
    }

    const mappedTask = {
      id: task.id,
      category: task.category,
      name: task.name,
      description: task.description,
      expected_start_date: task.expected_start_date?.toISOString().split('T')[0],
      expected_hours: task.expected_hours,
      hourly_rate: task.hourly_rate,
      rate_currency: task.rate_currency,
      status: task.status,
    };
    res.status(constants.HTTP_STATUS_OK).json({ task: mappedTask});
  } catch (e) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Get task failed", details: e });
  }
};
