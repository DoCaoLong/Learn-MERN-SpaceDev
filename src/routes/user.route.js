import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema } from "../schema/user";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const userRouter = Router();

userRouter
  .get("", UserController.get)
  .get("/:id", UserController.getDetail)
  .post("", UserController.create)
  .put("/:id", jwtMiddleware, UserController.updateById)
  .delete("/:id", UserController.deleteById)
  .post("/register", validate(registerSchema), UserController.register);

export default userRouter;
