import _ from "lodash";
import { BadRequest, Created, NoContent, Success } from "../config/statusCode";
import { Task } from "../models/task.model";
import { HttpResponse } from "../utils/HttpResponse";
import { DEFAULT_LIMIT } from "../config/database";

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
    let { page = 1, sort } = req.query;
    // let categoryName = req.query["category.name"];
    // let categories = categoryName.split(",");
    page = parseInt(page); // parseInt vì truyền params là string
    let _query = _.omit(req.query, "page", "sort", "category.name");
    let _sort = sort?.split(",") || ["_id", "desc"];
    let sortBy, sortValue;
    if (_sort.length === 2) {
      sortBy = _sort[0];
      sortValue = _sort[1];
    } else {
      // sort custom
      if (sort === "newwest") {
        sortBy = ".....";
        sortValue = "desc";
      }
    }
    // if (categories.length) {
    //   _query["category.name"] = { $in: categories };
    // }
    res.json(
      HttpResponse.Paginate(
        await Task.paginate(_query, page, DEFAULT_LIMIT, sortBy, sortValue)
      )
    );
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
      const { title, description, category, users, color } = req.body;
      const newTask = {
        title,
        description,
        category,
        users,
        color,
        isDone: false,
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
    const { title, description, category, users, color, isDone } = req.body;
    let check = await Task.updateById(id, {
      title,
      description,
      category,
      users,
      color,
      isDone,
    });
    if (check) {
      res.status(Success).json({ Update: true });
    } else {
      res.status(BadRequest).json(HttpResponse.error("Task not found"));
    }
  },

  updatePartial: async (req, res) => {
    const { title, description, users, category, color, isDone } = req.body;
    const { id } = req.params;
    let task = await Task.findById(id);
    if (task) {
      res.json({
        updated: await Task.updateById(id, {
          title: title ?? task.title,
          description: description ?? task.description,
          isDone: isDone ?? task.isDone,
          users: users ?? task.users,
          category: category ?? task.category,
          color: color ?? task.color,
        }),
      });
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
