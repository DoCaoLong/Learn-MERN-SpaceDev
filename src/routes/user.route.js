import { Router } from "express";
import { User } from "../models/user.model";

const userRouter = Router();

userRouter.get("", (req, res) => {
  res.json(User.find(req.query));
});

userRouter.get("/:id", (req, res) => {
  let u = User.findById(req.params.id);
  if (u) {
    return res.status(200).json(u);
  }
  res.json.status(400).json({ Error: "User not found" });
});

userRouter.post("", (req, res) => {
  let u = User.create(req.body);
  if (u) {
    return res.status(200).json(u);
  }
  res.status(400).json({ Error: "Error" });
});

userRouter.put(":/id", (req, res) => {
  let u = User.updateById(req.params.id, req.body);
  if (u) {
    res.status(200).json({ Update: true });
  }
  res.status(400).json({ Error: "Update not found" });
});

userRouter.delete(":/id", (req, res) => {
  let u = User.deleteById(req.params.id);
  if (u) {
    res.status(200).json({ Delete: true });
  }
  res.status(400).json({ Error: "Delete error" });
});

export default userRouter;
