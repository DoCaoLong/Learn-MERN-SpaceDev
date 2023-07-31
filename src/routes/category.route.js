import { Router } from "express";
import { Category } from "../models/category.model";
import { HttpResponse } from "../utils/HttpResponse";
import { BadRequest, Success } from "../config/statusCode";

const categoryRouter = Router();

categoryRouter.get("", (req, res) => {
  res.json(HttpResponse.detail(Category.find(req.query)));
});

categoryRouter.get("/:id", (req, res) => {
  let check = Category.findById(req.params.id);
  if (check) {
    res.status(Success).json(HttpResponse.detail(check));
  } else {
    res.status(BadRequest).json(HttpResponse.error("Categories not found"));
  }
});

categoryRouter.post("", (req, res) => {
  const { name, color } = req.body;
  res.json(HttpResponse.created(Category.create({ name, color })));
});

categoryRouter.put("/:id", (req, res) => {
  const { name, color } = req.body;
  const { id } = req.params;
  let check = Category.updateById(id, { name, color });
  if (check) {
    res.status(Success).json({ Update: true });
  } else {
    res.status(BadRequest).json(HttpResponse.error("Update Categories Error"));
  }
});

categoryRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  let check = Category.deleteById(id);
  if (check) {
    res.status(Success).json({ Delete: true });
  } else {
    res.status(BadRequest).json(HttpResponse.error("Delete Error"));
  }
});

export default categoryRouter;
