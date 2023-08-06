import { NotFound, BadRequest, Success } from "../config/statusCode";
import { Category } from "../models/category.model";
import { HttpResponse } from "../utils/HttpResponse";

export const CategoryController = {
  get: async (req, res) => {
    let detail = await Category.paginate(req.query);
    if (detail) {
      return res.status(Success).json(HttpResponse.Paginate(detail));
    }
    res.status(BadRequest).json(HttpResponse.error("Category not found"));
  },

  getDetail: async (req, res) => {
    let detail = await Category.findById(req.params.id);
    if (detail) {
      return res.json(HttpResponse.detail(detail));
    }
    res.status(NotFound).json(HttpResponse.notFound("Category not found"));
  },

  create: async (req, res) => {
    const { name, color } = req.body;
    res.json(HttpResponse.created(await Category.create({ name, color })));
  },

  updateById: async (req, res) => {
    const { name, color } = req.body;
    const { id } = req.params;
    let check = await Category.updateById(id, { name, color });
    if (check) {
      res.status(Success).json({ Update: true });
    } else {
      res
        .status(BadRequest)
        .json(HttpResponse.error("Update Categories Error"));
    }
  },

  deleteById: async (req, res) => {
    const { id } = req.params;
    let check = await Category.deleteById(id);
    if (check) {
      res.status(Success).json({ Delete: true });
    } else {
      res.status(BadRequest).json(HttpResponse.error("Delete Error"));
    }
  },
};
