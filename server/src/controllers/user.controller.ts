import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt"; // Import for security
import { db } from "@/config/db";
import { users } from "@/models/index";
import { type CreateUserBody } from "@/validations/user.validation";

export const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    const { password: _, ...userWithoutPassword } = newUser[0]!;

    res.status(StatusCodes.CREATED).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      })
      .from(users);

    res.status(StatusCodes.OK).json(allUsers);
  } catch (error) {
    next(error);
  }
};
