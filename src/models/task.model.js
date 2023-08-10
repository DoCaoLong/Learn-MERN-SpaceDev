import _ from "lodash";
import mongoose, { Schema } from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: "text",
    },
    description: {
      type: String,
      required: true,
      index: "text",
    },
    color: {
      type: Schema.Types.String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      getCategory: async function () {
        let task = await this.populate("category");
        return task.category;
      },
    },
    statics: {},
  }
);

TaskSchema.index({ title: "text", description: "text" });

const TaskModel = mongoose.model("Task", TaskSchema);

const paginate = async (query) => {
  return TaskModel.paginate(query);
};

const count = async (query) => {
  let _query = _.omit(query, "title", "isDone", "minStartDate", "maxStartDate");

  if (query.title) {
    _query.$text = { $search: query.title };
  }

  if (query.isDone) {
    _query.isDone = query.isDone === "true";
  }

  let count = await TaskModel.countDocuments(_query);

  return count;
};

const find = async (query) => {};

const findById = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const task = await TaskModel.findById(id);
      if (task) {
        return task;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};

const create = async (data) => {
  try {
    let task = new TaskModel(data);
    await task.save();
    return task;
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, dataUpdate) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const result = await TaskModel.updateOne(
        { _id: id },
        { $set: dataUpdate }
      );
      return dataUpdate;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};

const deleteById = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      let task = await TaskModel.deleteOne({ _id: id });
      return task;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};

const getCategoryById = async (id) => {
  let task = await TaskModel.findOne({ _id: id });
  let category = await task.getCategory();
  return category;
};

export const Task = {
  count,
  paginate,
  find,
  findById,
  create,
  updateById,
  deleteById,
  getCategoryById,
};
