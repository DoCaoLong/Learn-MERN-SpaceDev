import { readJsonFile, writeJsonFile } from "../utils/file";
import _ from "lodash";

const users = readJsonFile("users") || [];

const find = (query) => {
  return _.filter(users, query);
};

const findById = (id) => {
  return users.find((e) => e.id === parseInt(id));
};

const findByIds = (ids) => {
  return users.filter((item) => ids.includes(item.id));
};

const create = (data) => {
  data.id = new Date().getTime();
  users.push(data);
  writeJsonFile("users", users);
  return data;
};

const updateById = (id, dataUpdate) => {
  let c = users.find((item) => item.id === +id);
  if (c) {
    Object.assign(c, dataUpdate);
    writeJsonFile("users", users);
    return true;
  }
  return false;
};

const deleteById = (id) => {
  let idx = users.findIndex((item) => item.id === +id);
  if (idx !== -1) {
    users.splice(idx, 1);
    writeJsonFile("users", users);
    return true;
  }
  return false;
};

export const User = {
  find,
  findById,
  findByIds,
  create,
  updateById,
  deleteById,
};
