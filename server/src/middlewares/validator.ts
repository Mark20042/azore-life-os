import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateBody = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Send a clean 400 Bad Request
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((e) => ({
            path: e.path[0],
            message: e.message,
          })),
        });
        return;
      }
      // Pass other errors to your global errorHandler.ts
      next(error);
    }
  };
};
