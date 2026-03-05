import { Router } from "express";
import type { Router as RouterType } from "express";
import { register, login, logout, getMe } from "@/controllers/auth.controller";
import { validateBody } from "@/middlewares/validator";
import {
  registerUserValidation,
  loginValidation,
} from "@/validations/user.validation";
import { authenticationMiddleware } from "@/middlewares/auth";

const router: RouterType = Router();

// POST /dawg/auth/register
router.post("/register", validateBody(registerUserValidation), register);

// POST /dawg/auth/login
router.post("/login", validateBody(loginValidation), login);

// POST /dawg/auth/logout
router.post("/logout", logout);

// GET /dawg/auth/me
router.get("/me", authenticationMiddleware, getMe);

export default router;
