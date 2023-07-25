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
  return {
    ...t,
    category: t.category ? Category.findById(t.category) : null,
    users: Array.isArray(t.users) ? User.findByIds(t.users) : null,
  };
};

const create = (data) => {
  console.log(data);
  data.id = new Date().getTime();
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
  let { title, description } = dataUpdate;
  let t = tasks.find((item) => item.id === +id);
  if (t) {
    t.title = title ?? t.title;
    t.description = description ?? t.description;
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

export const Tasks = {
  find,
  findById,
  create,
  updateById,
  patchById,
  deleteById,
};
