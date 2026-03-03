import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "@/errors/index";

interface JWTPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticationMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new UnauthenticatedError("No token provided");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JWTPayload;

    req.user = decoded;

    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};
