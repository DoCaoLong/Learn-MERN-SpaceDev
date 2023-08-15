import _ from "lodash";
import { BadRequest, Created, NoContent, Success } from "../config/statusCode";
import { Task, TaskModel } from "../models/task.model";
import { HttpResponse } from "../utils/HttpResponse";

export const TaskController = {
  count: async (req, res) => {
    let { page = 1 } = req.query;
    page = parseInt(page);
    let _query = _.omit(req.query, "page");
    res
      .status(Success)
      .json(HttpResponse.success({ count: await Task.count(_query) }));
  },

  get: async (req, res) => {
    res.json(HttpResponse.Paginate(await Task.paginate(req.query)));
    // const result = await TaskModel.find().populate("users");
    // console.log(result);
    // res.json({ result });
  },

  getDetail: async (req, res) => {
    let detail = await Task.findById(req.params.id);
    if (detail) {
      return res.status(Success).json(HttpResponse.success(detail));
    }
    res.status(BadRequest).json(HttpResponse.error("Task not found"));
  },

  create: async (req, res, next) => {
    try {
      const { title, description, category, users, color, startDate } =
        req.body;
      const newTask = {
        title,
        description,
        category,
        users,
        color,
        isDone: false,
        startDate,
      };

      res
        .status(Created)
        .json(HttpResponse.created(await Task.create(newTask)));
    } catch (err) {
      // next(err);
      next(false);
    }
  },

  updateById: async (req, res) => {
    const { id } = req.params;
    const { title, description, category, users, color, isDone, startDate } =
      req.body;
    let check = await Task.updateById(id, {
      title,
      description,
      category,
      users,
      color,
      isDone,
      startDate,
    });
    if (check) {
      res.status(Success).json({ Update: true });
    } else {
      res.status(BadRequest).json(HttpResponse.error("Task not found"));
    }
  },

  updatePartial: async (req, res) => {
    const { title, description, users, category, color, isDone, startDate } =
      req.body;
    const { id } = req.params;
    let task = await Task.findById(id);
    if (task) {
      res.status(Success).json(
        HttpResponse.updated(
          await Task.updateById(id, {
            title: title ?? task.title,
            description: description ?? task.description,
            isDone: isDone ?? task.isDone,
            users: users ?? task.users,
            category: category ?? task.category,
            color: color ?? task.color,
            startDate: startDate ?? task.startDate,
          })
        )
      );
    } else {
      res.status(BadRequest).json({ error: "Task not found" });
    }
  },

  deleteById: async (req, res) => {
    const { id } = req.params;
    let check = await Task.deleteById(id);
    if (check) {
      res.status(NoContent).json({ Delete: true });
    } else {
      res.status(BadRequest).json({ error: "Task not found" });
    }
  },

  getCategoryById: async (req, res) => {
    let { id } = req.params;
    let category = await Task.getCategoryById(id);
    res.json(HttpResponse.success(category));
  },
};
