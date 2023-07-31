import { writeJsonFile, readJsonFile } from "../utils/file";
import { Category } from "./category.model";
import { User } from "./user.model";
import _ from "lodash";

const tasks = readJsonFile("tasks") || [];

const find = (query) => {
  return _.filter(tasks, query).map((e) => {
    return {
      ...e,
      category: e.category ? Category.findById(e.category) : null,
      users: Array.isArray(e.users) ? User.findByIds(e.users) : null,
    };
  });
};

const findById = (id) => {
  let t = tasks.find((item) => item.id === +id);
  if (t) {
    return {
      ...t,
      category: t.category ? Category.findById(t.category) : null,
      users: Array.isArray(t.users) ? User.findByIds(t.users) : null,
    };
  }
  return false;
};

const create = (data) => {
  data.id = new Date().getTime();
  if (data.category) {
    let checkCate = Category.findById(data.category);
    // check category
    if (!checkCate) {
      throw "Category not found";
    }
    // check users
    if (Array.isArray(data.users)) {
      let check = User.findByIds(data.users).length === data.users.length;
      if (!check) {
        throw "User not found";
      }
    }
  }
  tasks.push(data);
  writeJsonFile("tasks", tasks);
  return data;
};

const updateById = (id, dataUpdate) => {
  let t = tasks.find((item) => item.id === +id);
  if (t) {
    Object.assign(t, dataUpdate);
    writeJsonFile("tasks", tasks);
    return true;
  }
  return false;
};

const patchById = (id, dataUpdate) => {
  let { title, description, users, category, color } = dataUpdate;
  console.log(users);
  let t = tasks.find((item) => item.id === +id);
  if (t) {
    t.title = title ?? t.title;
    t.description = description ?? t.description;
    t.users = users ?? t.users;
    t.category = category ?? t.category;
    t.color = color ?? t.color;
    writeJsonFile("tasks", tasks);
    return true;
  }
  return false;
};

const deleteById = (id) => {
  let idx = tasks.findIndex((item) => item.id === +id);
  if (idx !== -1) {
    tasks.splice(idx, 1);
    writeJsonFile("tasks", tasks);
    return true;
  }
  return false;
};

export const Task = {
  find,
  findById,
  create,
  updateById,
  patchById,
  deleteById,
};
