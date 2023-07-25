import { Router } from "express";
import { Category } from "../models/category.model";

const categoryRouter = Router();

categoryRouter.get("", (req, res) => {
  res.json(Category.find(req.query));
});

categoryRouter.get("/:id", (req, res) => {
  let check = Category.findById(req.params.id);
  if (check) {
    res.status(200).json(check);
  } else {
    res.status(400).json("Categories not found");
  }
});

categoryRouter.post("", (req, res) => {
  const { name } = req.body;
  res.json(Category.create({ name }));
});

categoryRouter.put("/:id", (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  let check = Category.updateById(id, { name });
  if (check) {
    res.status(200).json({ Update: true });
  } else {
    res.status(400).json("Update Categories Error");
  }
});

categoryRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  let check = Category.deleteById(id);
  if (check) {
    res.status(200).json({ Delete: true });
  } else {
    res.status(400).json("Delete Error");
  }
});

export default categoryRouter;
