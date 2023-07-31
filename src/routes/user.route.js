import { Router } from "express";
import { User } from "../models/user.model";
import { HttpResponse } from "../utils/HttpResponse";
import { BadRequest, Success } from "../config/statusCode";
import { validate } from "../middleware/validate.middleware";
import Joi from "joi";
import { validatePassowrd } from "../utils/validate";

const userRouter = Router();

const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.required().custom(validatePassowrd),
});

userRouter
  .get("", (req, res) => {
    res.json(HttpResponse.detail(User.find(req.query)));
  })
  .get("/:id", (req, res) => {
    let u = User.findById(req.params.id);
    if (u) {
      return res.status(Success).json(HttpResponse.detail(u));
    }
    res.json.status(BadRequest).json(HttpResponse.error("User not found"));
  })
  .post("", (req, res) => {
    let u = User.create(req.body);
    if (u) {
      return res.status(Success).json(HttpResponse.created(u));
    }
    res.status(BadRequest).json(HttpResponse.error("Error"));
  })
  .put("/:id", (req, res) => {
    let { name, avatar } = req.body;
    let u = User.updateById(req.params.id, { name, avatar });
    if (u) {
      return res.status(Success).json({ Update: true });
    }
    res.status(BadRequest).json(HttpResponse.error("Update not found"));
  })
  .delete("/:id", (req, res) => {
    let u = User.deleteById(req.params.id);
    if (u) {
      return res.status(Success).json({ Delete: true });
    }
    res.status(BadRequest).json(HttpResponse.error("Delete error"));
  })
  .post("/register", validate(registerSchema), (req, res) => {
    res.json(HttpResponse.success({ success: true }));
  });

export default userRouter;
