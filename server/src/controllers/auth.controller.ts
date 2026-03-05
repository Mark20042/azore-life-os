import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { db } from "@/config/db";
import { users } from "@/models/index";
import {
  type RegisterBody,
  type LoginBody,
} from "@/validations/user.validation";
import { generateTokens } from "@/utils/generateToken";
import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} from "@/errors/index";
import { type AuthRequest } from "@/middlewares/auth";

const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.body;

    const userExist = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userExist.length > 0) {
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning();

    const user = newUser[0]!;

    generateTokens(user, res);

    const { password: _, ...safeUser } = user;

    res.status(StatusCodes.CREATED).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user[0]!.password);

    if (!isValidPassword) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    generateTokens(user[0]!, res);

    const { password: _, ...safeUser } = user[0]!;
    res.status(StatusCodes.OK).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken");
    res.status(StatusCodes.OK).json({ msg: "User logged out" });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw new NotFoundError("User not found");
    }

    const { password: _, ...safeUser } = user[0]!;

    res.status(StatusCodes.OK).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
};
export { register, login, logout, getMe };
