import _ from "lodash";
import { Task as TaskRepository } from "../config/database";
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
const paginate = async (query) => {
  return TaskRepository.paginate(query, [
    {
      $lookup: {
        from: "categories", // Tên collection cần ghép nối
        localField: "category", // Trường trong collection "task" tham chiếu đến "category"
        foreignField: "_id", // Trường trong collection "users" được tham chiếu
        as: "category", // Tên cho mảng kết quả của ghép nối
      },
    },
    {
      // Chuyển đổi bảng kết nối thành các bản ghi đơn lẻ (qh 1-1)
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      },
    },
  ]);
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
  if (data.category) data.category = new ObjectId(data.category);
  if (Array.isArray(data.users))
    data.users = data.users.map((e) => new ObjectId(e));
  let result = await TaskRepository.insertOne(data);
  data._id = result.insertedId;

  return data;
};

const updateById = async (id, dataUpdate) => {
  if (ObjectId.isValid(id)) {
    let result = await TaskRepository.updateOne(
      { _id: new ObjectId(id) },
      { $set: dataUpdate }
    );
    // return result.modifiedCount >= 1;
    return dataUpdate;
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
