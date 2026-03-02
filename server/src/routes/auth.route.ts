import { Router } from "express";
import type { Router as RouterType } from "express";
import { register, login, logout } from "@/controllers/auth.controller"; // Adjust path if needed
import { validateBody } from "@/middlewares/validator";
import {
  registerUserValidation,
  loginValidation,
} from "@/validations/user.validation";

const router: RouterType = Router();

router.post("/register", validateBody(registerUserValidation), register);

router.post("/login", validateBody(loginValidation), login);

router.post("/logout", logout);

export default router;
