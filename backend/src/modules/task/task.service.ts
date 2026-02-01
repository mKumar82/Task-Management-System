import { TaskStatus } from "@prisma/client";
import prisma from "../../prisma/client";

export const createTask = async (
  userId: string,
  title: string,
  description?: string,
) => {
  return prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
};

export const getTasks = async (
  userId: string,
  page = 1,
  limit = 10,
  status?: TaskStatus,
  search?: string,
) => {
  const skip = (page - 1) * limit;

  return prisma.task.findMany({
    where: {
      userId,
      ...(status && { status }),
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: { title?: string; description?: string; completed?: boolean },
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found or unauthorized");
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found or unauthorized");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};

export const toggleTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found or unauthorized");
  }

  let nextStatus:TaskStatus;
  switch (task.status) {
    case "TODO":
      nextStatus = "IN_PROGRESS";
      break;
    case "IN_PROGRESS":
      nextStatus = "DONE";
      break;
    default:
      nextStatus = "TODO";
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status: nextStatus },
  });
};
