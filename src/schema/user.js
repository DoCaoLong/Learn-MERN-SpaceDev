import Joi from "joi";
import { validatePassowrd } from "../utils/validate";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.required().custom(validatePassowrd),
  email: Joi.string().email(),
});

export const verifyRegisterSchema = Joi.object({
  code: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  redirect: Joi.string().required(),
});

export const resetPasswordByCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  // oldPassword: Joi.string().required(),
  newPassword: Joi.required().custom(validatePassowrd),
});
