import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import {
  forgotPasswordSchema,
  registerSchema,
  verifyRegisterSchema,
  resetPasswordByCodeSchema,
} from "../schema/user";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const userRouter = Router();

userRouter
  .get("", UserController.get)
  .get(
    "/verify-register",
    validate(verifyRegisterSchema),
    UserController.verifyRegister
  )
  .get("/:id", UserController.getDetail)
  .post("", UserController.create)
  .put("/:id", jwtMiddleware, UserController.updateById)
  .delete("/:id", UserController.deleteById)
  .post("/register", validate(registerSchema), UserController.register)
  .post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    UserController.forgotPassword
  )
  .post(
    "/reset-password-by-code",
    validate(resetPasswordByCodeSchema),
    UserController.resetPasswordByCode
  );

export default userRouter;
