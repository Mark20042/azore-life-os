import { Router } from "express";
import type { Router as RouterType } from "express";
import { register, login, logout } from "@/controllers/auth.controller";
import { validateBody } from "@/middlewares/validator";
import {
  registerUserValidation,
  loginValidation,
} from "@/validations/user.validation";

const router: RouterType = Router();

// POST /dawg/auth/register
router.post("/register", validateBody(registerUserValidation), register);

// POST /dawg/auth/login
router.post("/login", validateBody(loginValidation), login);

// POST /dawg/auth/logout
router.post("/logout", logout);

export default router;
