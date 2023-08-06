import { BadRequest, NotFound, Success } from "../config/statusCode";
import { User } from "../models/user.model";
import { HttpResponse } from "../utils/HttpResponse";

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
      return res.json(HttpResponse.detail(await User.findById(req.params.id)));
    }
    res.status(BadRequest).json(HttpResponse.error("User not found"));
  },

  create: async (req, res) => {
    const { name, age, gender } = req.body;
    res
      .status(Success)
      .json(HttpResponse.created(await User.create({ name, age, gender })));
  },

  updateById: async (req, res) => {
    const { name, avatar } = req.body;
    const { id } = req.params;
    let check = await User.updateById(id, { name, avatar });
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

  register: (req, res) => {
    res.json(HttpResponse.success({ success: true }));
  },
};
