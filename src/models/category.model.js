import _ from "lodash";
import { Category as CategoryRepository } from "../config/database";
import { ObjectId } from "mongodb";

const find = async (query) => {
  let _query = _.omit(query, "color");
  if (query.name) {
    _query.$text = { $search: query.name };
  }
  return await CategoryRepository.find(_query).toArray();
};
const findById = async (id) => {
  if (ObjectId.isValid(id)) {
    return await CategoryRepository.findOne({ _id: new ObjectId(id) });
  }

  return null;
};
const create = async (data) => {
  const result = await CategoryRepository.insertOne(data);
  if (result.insertedId) {
    data._id = result.insertedId;
    return data;
  }
  return false;
};
const updateById = async (id, dataUpdate) => {
  if (ObjectId.isValid(id)) {
    let result = await CategoryRepository.updateOne(
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

export const Category = {
  find,
  findById,
  create,
  updateById,
  deleteById,
};
