import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../schema/auth";
import Joi from "joi";

export const authRouter = Router();

authRouter
  .post("/login", validate(loginSchema), AuthController.login)
  .post(
    "/refresh-token",
    validate(Joi.object({ refreshToken: Joi.string().required() })),
    AuthController.refreshToken
  );
