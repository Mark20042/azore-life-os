import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { User } from "@/models/users";

export const generateTokens = (user: User, res: Response): void => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
    } as jwt.SignOptions,
  );

  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN!);
  const cookieMaxAge = days * 24 * 60 * 60 * 1000;

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents XSS attacks
    secure: isProduction, // Only sends over HTTPS in production
    sameSite: isProduction ? "none" : "strict",
    maxAge: cookieMaxAge,
  });
};
