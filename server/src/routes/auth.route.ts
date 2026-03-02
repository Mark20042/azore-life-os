import { Router } from "express";
import type { Router as RouterType } from "express";
import { register } from "@/controllers/auth.controller";
import { validateBody } from "@/middlewares/validator";
import { createUserValidation } from "@/validations/user.validation";

const router: RouterType = Router();

router.post("/", validateBody(createUserValidation), register);

export default router;
