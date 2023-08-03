import { Router } from "express";
import { User } from "../models/user.model";
import { HttpResponse } from "../utils/HttpResponse";
import { BadRequest, Success } from "../config/statusCode";
import { validate } from "../middleware/validate.middleware";
import { registerSchema } from "../schema/user";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();

userRouter
  .get("", UserController.get)
  .get("/:id", UserController.getDetail)
  .post("", UserController.create)
  .put("/:id", UserController.updateById)
  .delete("/:id", UserController.deleteById)
  .post("/register", validate(registerSchema), UserController.register);

export default userRouter;
