import { Router } from "express";
import { delay } from "../utils/delay";
import { Tasks } from "../models/task.model";
const taskRouter = Router();

// get task
taskRouter.get("", async (req, res) => {
  await delay(1000);
  res.json(Tasks.find(req.query));
});

// get task detail
taskRouter.get("/:id", (req, res) => {
  let t = Tasks.findById(req.params.id);
  if (t) {
    return res.status(200).json(t);
  }
  res.status(400).json({ Error: "Tasks not found" });
});

// post task
taskRouter.post("", async (req, res) => {
  await delay(1000);
  res.status(201).json(Tasks.create(req.body));
});

// update mutil task
taskRouter.put("/:id", async (req, res) => {
  await delay(1000);
  const { id } = req.params;
  const data = req.body;
  let check = Tasks.updateById(id, data);
  if (check) {
    res.status(200).json({ Update: true });
  } else {
    res.status(400).json("Update not found");
  }
  res.json();
});

// update single task
taskRouter.patch("/:id", async (req, res) => {
  await delay(1000);
  let check = Tasks.patchById(req.params.id, req.body);
  if (check) {
    res.status(200).json({ Update: true });
  } else {
    res.status(400).json("Update By Id not found");
  }
  res.json();
});

// delete task
taskRouter.delete("/:id", async (req, res) => {
  await delay(1000);
  let check = Tasks.deleteById(req.params.id);
  if (check) {
    res.status(200).json({ Detele: true });
  } else {
    res.status(400).json("Delete not found");
  }
});

export default taskRouter;
