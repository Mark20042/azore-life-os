import type { Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");

export const notFoundMiddleware = (req: Request, res: Response) =>
  res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
