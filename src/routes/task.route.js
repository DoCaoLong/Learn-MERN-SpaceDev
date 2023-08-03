import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import { updateTaskSchema } from "../schema/task";

const taskRouter = Router();

taskRouter
  .get("/count", TaskController.count)
  .get("", TaskController.get)
  .get("/:id", TaskController.getDetail)
  .post("", TaskController.create)
  .put("/:id", TaskController.updateById)
  .patch("/:id", validate(updateTaskSchema), TaskController.updatePartial)
  .delete("/:id", TaskController.deleteById);

export default taskRouter;
