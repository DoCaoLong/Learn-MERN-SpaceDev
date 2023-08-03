import _ from "lodash";
import { User as UserRepository } from "../config/database";
import { ObjectId } from "mongodb";

const find = async (query) => {
  let _query = _.omit(query, "name", "age");

  if (query.age) {
    _query.age = query.age;
  }

  if (query.name) {
    // c1 search basic
    // _query.name = { $regex: new RegExp(query.name, "i") }; // "i": k pb hoa thuong
    // c2 search advance k dau, $text: config ở datadase.js
    _query.$text = { $search: query.name };
  }

  return await UserRepository.find(_query).toArray();
};

const findById = async (id) => {
  if (ObjectId.isValid(id)) {
    return await UserRepository.findOne({ _id: new ObjectId(id) });
  }

  return null;
  // return users.find((e) => e.id === parseInt(id));
};

const findByIds = (ids) => {
  return users.filter((e) => ids.includes(e.id));
};
const create = async (data) => {
  const result = await UserRepository.insertOne(data);
  if (result.insertedId) {
    data._id = result.insertedId;
    return data;
  }
  return false;
};
const updateById = async (id, dataUpdate) => {
  if (ObjectId.isValid(id)) {
    let result = await UserRepository.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: dataUpdate,
      }
    );
    return result.modifiedCount >= 1;
  }

  return false;
};
const deleteById = async (id) => {
  if (ObjectId.isValid(id)) {
    let result = await UserRepository.deleteOne({ _id: new ObjectId(id) });
    return result.modifiedCount >= 1;
  }

  return false;
};

export const User = {
  find,
  findById,
  create,
  updateById,
  deleteById,
  findByIds,
};
