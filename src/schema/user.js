import Joi from "joi";
import { validatePassowrd } from "../utils/validate";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.required().custom(validatePassowrd),
});
