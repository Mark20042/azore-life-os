import { Router } from "express";
import type { Router as RouterType } from "express";
import { createUser, getUsers } from "@/controllers/user.controller";
import { validateBody } from "@/middlewares/validator";
import { createUserValidation } from "@/validations/user.validation";

const router: RouterType = Router();

router.post("/", validateBody(createUserValidation), createUser);
router.get("/", getUsers);

export default router;
