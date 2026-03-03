import { type Response, type NextFunction } from "express";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { db } from "@/config/db";
import { tasks, type Task, type NewTask } from "@/models/index";
import { type AuthRequest } from "@/middlewares/auth";
import { BadRequestError, NotFoundError } from "@/errors/index";

export const getMyTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;

    if (!userId) {
      throw new BadRequestError("User ID not found in request");
    }

    const { priority, category, isCompleted, startDate, endDate, sortBy } =
      req.query;

    const conditions = [eq(tasks.userId, userId)];

    if (priority) {
      conditions.push(
        eq(tasks.priority, priority as "low" | "medium" | "high"),
      );
    }

    if (category) {
      conditions.push(eq(tasks.category, category as string));
    }

    if (isCompleted !== undefined) {
      const isCompletedBool = isCompleted === "true";
      conditions.push(eq(tasks.isCompleted, isCompletedBool));
    }

    if (startDate) {
      conditions.push(gte(tasks.deadline, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(tasks.deadline, new Date(endDate as string)));
    }

    let orderByClause = desc(tasks.createdAt);
    if (sortBy === "deadline_asc") {
      orderByClause = asc(tasks.deadline);
    } else if (sortBy === "deadline_desc") {
      orderByClause = desc(tasks.deadline);
    }

    const myTasks: Task[] = await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(orderByClause);

    res
      .status(StatusCodes.OK)
      .json({ success: true, count: myTasks.length, tasks: myTasks });
  } catch (error) {
    next(error);
  }
};

export const getSingleTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const taskId = parseInt(id as string);

    if (isNaN(taskId)) {
      throw new BadRequestError("Invalid Task ID provided");
    }

    const task: Task[] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    if (task.length === 0) {
      throw new NotFoundError("Task not found or unauthorized");
    }

    res.status(StatusCodes.OK).json({ success: true, task: task[0] });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, deadline, priority, category } = req.body;
    const userId = req.user!.userId;

    const taskData: NewTask = {
      title,
      description,
      deadline: new Date(deadline),
      priority,
      category,
      userId,
    };

    const newTask = await db.insert(tasks).values(taskData).returning();

    res.status(StatusCodes.CREATED).json({ success: true, task: newTask[0] });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const taskId = parseInt(id as string);

    if (isNaN(taskId)) {
      throw new BadRequestError("Invalid Task ID provided");
    }

    const updatedTask = await db
      .update(tasks)
      .set(req.body)
      .where(
        and(
          eq(tasks.id, taskId),
          eq(tasks.userId, userId), // match task id and user id
        ),
      )
      .returning();

    if (updatedTask.length === 0) {
      throw new NotFoundError("Task not found or unauthorized");
    }

    res.status(StatusCodes.OK).json({ success: true, task: updatedTask[0] });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const taskId = parseInt(id as string);

    if (isNaN(taskId)) {
      throw new BadRequestError("Invalid Task ID provided");
    }

    const deletedTask = await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, taskId),
          eq(tasks.userId, userId), // match task id and user id
        ),
      )
      .returning();

    if (deletedTask.length === 0) {
      throw new NotFoundError("Task not found or unauthorized");
    }

    res.status(StatusCodes.OK).json({ success: true, task: deletedTask[0] });
  } catch (error) {
    next(error);
  }
};
