import _ from "lodash";
import { BadRequest, Created, NoContent, Success } from "../config/statusCode";
import { Task } from "../models/task.model";
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
  },

  getDetail: async (req, res) => {
    let detail = Task.findById(req.params.id);
    if (detail) {
      return res
        .status(Success)
        .json(HttpResponse.success(await Task.findById(req.params.id)));
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
      next(err);
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
      res.status(NoContent).json({ deleted: true });
    } else {
      res.status(BadRequest).json({ error: "Task not found" });
    }
  },
};
