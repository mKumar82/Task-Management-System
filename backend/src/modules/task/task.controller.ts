import { Request, Response } from "express";
import * as taskService from "./task.service";

import { TaskStatus } from "@prisma/client";

export const create = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await taskService.createTask(req.userId!, title, description);

  res.status(201).json(task);
};

export const getAll = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const statusParam = req.query.status as string | undefined;
    const status =
      statusParam &&
      Object.values(TaskStatus).includes(statusParam as TaskStatus)
        ? (statusParam as TaskStatus)
        : undefined;
//   const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;

  const tasks = await taskService.getTasks(
    req.userId!,
    page,
    limit,
    status,
    search,
  );

  res.json({
    page,
    limit,
    count: tasks.length,
    tasks,
  });
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await taskService.updateTask(id, req.userId!, req.body);

  res.json(task);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  await taskService.deleteTask(id, req.userId!);
  res.status(204).send();
};

export const toggle = async (req: Request, res: Response) => {
  const task = await taskService.toggleTask(req.params.id, req.userId!);

  res.json(task);
};
