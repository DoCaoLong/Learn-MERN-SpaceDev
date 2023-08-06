import Joi from "joi";
import { Category, User } from "../config/database";

export const updateTaskSchema = Joi.object({
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
  isDone: Joi.boolean().optional().default(false),
  startDate: Joi.number().optional(),
});

// kế thừa hàm update và thêm 2 trường là required
export const createTaskSchema = updateTaskSchema.fork(
  ["title", "category"],
  (schema) => schema.required()
);
