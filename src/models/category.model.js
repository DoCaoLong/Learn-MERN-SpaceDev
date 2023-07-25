import { readJsonFile, writeJsonFile } from "../utils/file";
import _ from "lodash";

const categories = readJsonFile("categories") || [];

const find = (query) => {
  return _.filter(categories, query);
};

const findById = (id) => {
  return categories.find((e) => e.id === parseInt(id));
};

const create = (data) => {
  data.id = new Date().getTime();
  categories.push(data);
  writeJsonFile("categories", categories);
  return data;
};

const updateById = (id, dataUpdate) => {
  let c = categories.find((item) => item.id === +id);
  if (c) {
    Object.assign(c, dataUpdate);
    writeJsonFile("categories", categories);
    return true;
  }
  return false;
};

const deleteById = (id) => {
  let idxCategories = categories.findIndex((item) => item.id === +id);
  if (idxCategories !== -1) {
    categories.splice(idxCategories, 1);
    writeJsonFile("categories", categories);
    return true;
  }
  return false;
};

export const Category = {
  find,
  findById,
  create,
  updateById,
  deleteById,
};
