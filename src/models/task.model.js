import { Category } from "./category.model";
import { User } from "./user.model";
import _ from "lodash";
import { DEFAULT_LIMIT, Task as TaskRepository } from "../config/database";
import { ObjectId } from "mongodb";

// phân trang cách 1 (FE handle nhiều hơn)
const count = async (query) => {
  let _query = _.omit(query, "title", "isDone");

  if (query.title) {
    _query.$text = { $search: query.title };
  }

  if (query.isDone) {
    _query.isDone = query.isDone === "true";
  }

  let count = await TaskRepository.countDocuments(_query);

  return count;
};

// phân trang cách 2 (khuyên dùng)
const paginate = async (query, page, perPage, sortBy, sortValue) => {
  let _query = _.omit(query, "title", "isDone");

  if (query.title) {
    _query.$text = { $search: query.title };
  }

  if (query.isDone) {
    _query.isDone = query.isDone === "true";
  }

  // perPage: số sản phầm mổi trang
  let skip = (page - 1) * perPage;

  // tổng số lượng document
  let count = await TaskRepository.countDocuments(_query);

  // tổng số trang
  let totalPage = Math.ceil(count / perPage);

  let result = await TaskRepository.find(_query)
    .limit(+perPage) // số lượng document lấy về
    .skip(skip) // bỏ qua bao nhiêu document
    .sort(sortBy, sortValue)
    .toArray();

  let response = {
    data: result,
    totalPage,
    currentPage: page,
    total: count,
  };

  if (page < totalPage) {
    response.nextPage = page + 1;
  }

  if (page > 1) {
    response.prevPage = page - 1;
  }

  return response;
};

const find = async (query) => {
  let _query = _.omit(query, "title", "isDone");

  if (query.title) {
    _query.$text = { $search: query.title };
  }

  if (query.isDone) {
    _query.isDone = query.isDone === "true";
  }
  let result = await TaskRepository.find(_query).toArray();
  return result;
};

const findById = async (id) => {
  if (ObjectId.isValid(id)) {
    return await TaskRepository.findOne({ _id: new ObjectId(id) });
  }

  return null;
};

const create = async (data) => {
  let result = await TaskRepository.insertOne(data);
  data._id = result.insertedId;

  return data;

  // data.id = new Date().getTime();
  // if(data.category) {
  //   let check = Category.findById(data.category)
  //   if(!check) {
  //     throw "Category not found"
  //   }
  // }
  // if(Array.isArray(data.users)) {
  //   let check = User.findByIds(data.users).length === data.users.length
  //   if(!check) {
  //     throw "User not found"
  //   }
  // }
  // tasks.push(data);
  // writeJsonFile("tasks", tasks);
  // return data;
};

const updateById = async (id, dataUpdate) => {
  if (ObjectId.isValid(id)) {
    let result = await TaskRepository.updateOne(
      { _id: new ObjectId(id) },
      { $set: dataUpdate }
    );
    return result.modifiedCount >= 1;
  }

  return false;
};
const deleteById = async (id) => {
  if (ObjectId.isValid(id)) {
    let result = await TaskRepository.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount >= 1;
  }
  return false;
};

export const Task = {
  count,
  paginate,
  find,
  findById,
  create,
  updateById,
  deleteById,
};
