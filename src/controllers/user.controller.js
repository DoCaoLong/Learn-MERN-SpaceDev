import { BadRequest, Success } from "../config/statusCode";
import { User, UserModel } from "../models/user.model";
import { HttpResponse } from "../utils/HttpResponse";
import crypto from "crypto";
import { randomCode } from "../utils/randomCode";

export const UserController = {
  get: async (req, res) => {
    let detail = await User.paginate(req.query);
    if (detail) {
      return res.status(Success).json(HttpResponse.Paginate(detail));
    }
    res.status(BadRequest).json(HttpResponse.error("User not found"));
  },

  getDetail: async (req, res) => {
    let detail = await User.findById(req.params.id);
    if (detail) {
      return res.status(Success).json(HttpResponse.detail(detail));
    }
    res.status(BadRequest).json(HttpResponse.error("User not found"));
  },

  create: async (req, res) => {
    const { name, age, gender, avatar } = req.body;
    res
      .status(Success)
      .json(
        HttpResponse.created(await User.create({ name, age, gender, avatar }))
      );
  },

  updateById: async (req, res) => {
    const { name } = req.body;
    const id = req.user; // lấy Id user từ middle ware
    let check = await User.updateById(id, { name });
    if (check) {
      res.status(Success).json(HttpResponse.updated(check));
    } else {
      res.status(BadRequest).json(HttpResponse.error("User not found"));
    }
  },

  deleteById: async (req, res) => {
    let check = await User.deleteById(req.params.id);
    if (check) {
      res.status(Success).json({ Delete: true });
    } else {
      res.status(BadRequest).json(HttpResponse.error("Delete error"));
    }
  },

  register: async (req, res, next) => {
    try {
      let check = await UserModel.findOne({ email: req.body.email });
      if (check) {
        return res
          .status(BadRequest)
          .json(HttpResponse.error("Email này đã tồn tại"));
      }
      let { password, email } = req.body;
      password = crypto.createHash("sha256").update(password).digest("hex");
      let code = randomCode(100);
      let user = await User.create({ ...req.body, password, code });
      user.password = undefined; // hidden field password
      res.status(Success).json(HttpResponse.success(user));
    } catch (error) {
      next(error);
    }
  },
};
