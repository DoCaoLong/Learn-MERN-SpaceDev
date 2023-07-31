import { Router } from "express";
import { delay } from "../utils/delay";
import { Task } from "../models/task.model";
import Joi from "joi";
import { validate } from "../middleware/validate.middleware";
import { Category } from "../models/category.model";
import { User } from "../models/user.model";
import { BadRequest, NoContent, Created, Success } from "../config/statusCode";
import { HttpResponse } from "../utils/HttpResponse";
const taskRouter = Router();

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().optional().allow(null),
  category: Joi.custom((value, helper) => {
    if (!Category.findById(value)) {
      return helper.message("Không tìm thấy category");
    }
  }),
  users: Joi.array()
    .items(Joi.number())
    .custom((value, helper) => {
      if (User.findByIds(value).length < value.length) {
        return helper.message("Không tìm thấy user");
      }
    }),
  color: Joi.string().optional().default("#ffffff"),
});

const createTaskSchema = updateTaskSchema.fork(
  ["title", "category"],
  (schema) => schema.required()
);

// get task
taskRouter.get("", async (req, res) => {
  await delay(200);
  res.json(HttpResponse.detail(Task.find(req.query)));
});

// get task detail
taskRouter.get("/:id", (req, res) => {
  let t = Task.findById(req.params.id);
  if (t) {
    return res.status(Success).json(t);
  }
  res.status(BadRequest).json(HttpResponse.error("Task ID not found"));
});

// post task
taskRouter.post("", validate(createTaskSchema), async (req, res, next) => {
  try {
    const { title, description, category, users, color } = req.body;
    const newTask = { title, description, category, users, color };
    res.status(Created).json(HttpResponse.created(Task.create(newTask)));
  } catch (error) {
    next(error);
  }
});

// update mutil task
taskRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category, users, color } = req.body;
  let check = Task.updateById(id, {
    title,
    description,
    category,
    users,
    color,
  });
  if (check) {
    res.status(Success).json({ Update: true });
  } else {
    res.status(BadRequest).json(HttpResponse.error("Task not found"));
  }
  res.json();
});

// update single task
taskRouter.patch("/:id", validate(updateTaskSchema), async (req, res) => {
  const { title, description, category, users, color } = req.body;
  let check = Task.patchById(req.params.id, {
    title,
    description,
    category,
    users,
    color,
  });
  if (check) {
    res.status(Success).json({ Update: true });
  } else {
    res.status(BadRequest).json(HttpResponse.error("Update By Id not found"));
  }
  res.json();
});

// delete task
taskRouter.delete("/:id", async (req, res) => {
  let check = Task.deleteById(req.params.id);
  if (check) {
    res.status(NoContent).json({ Detele: true });
  } else {
    res.status(BadRequest).json(HttpResponse.error("Id not found"));
  }
});

export default taskRouter;
