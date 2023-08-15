import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import { updateTaskSchema, createTaskSchema } from "../schema/task";
import { jwtMiddleware } from "../middleware/jwt.middleware";

const taskRouter = Router();

taskRouter
  .get("/count", TaskController.count)
  .get("", TaskController.get)
  .get("/:id", TaskController.getDetail)
  .post("", validate(createTaskSchema), TaskController.create)
  .put("/:id", TaskController.updateById)
  .patch(
    "/:id",

    validate(updateTaskSchema),
    TaskController.updatePartial
  )
  .delete("/:id", TaskController.deleteById)
  .get("/get-category/:id", TaskController.getCategoryById);

export default taskRouter;
