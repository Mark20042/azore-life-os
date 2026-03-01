import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // log the error details to logger with request info and stack trace
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    stack: err.stack,
  });

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};
