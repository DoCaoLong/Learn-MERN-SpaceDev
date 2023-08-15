import _ from "lodash";
import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    // required: true,
  },
});

export const CategoryModel = mongoose.model("Category", CategorySchema);

const paginate = async (query) => {
  return CategoryModel.paginate(query);
};

const find = async (query) => {
  // let _query = _.omit(query, "color");
  // if (query.name) {
  //   _query.$text = { $search: query.name };
  // }
  // return await CategoryRepository.find(_query).toArray();
};

export const findById = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const category = await CategoryModel.findOne({ _id: id });
      return category;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return null;
};

const create = async (data) => {
  const newCategory = new CategoryModel(data);
  try {
    await newCategory.save();
    return newCategory;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// // c2 using create
// const create = async (data) => {
//   try {
//     const newCategory = await CategoryModel.create(data);
//     return newCategory;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };

const updateById = async (id, dataUpdate) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const result = await CategoryModel.updateOne(
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

// // c2 using findByIdAndUpdate
// const updateById = async (id, dataUpdate) => {
//   if (mongoose.isValidObjectId(id)) {
//     try {
//       const updatedCategory = await CategoryModel.findByIdAndUpdate(
//         id,
//         dataUpdate,
//         { new: true }
//       );
//       return !!updatedCategory;
//     } catch (error) {
//       console.error(error);
//       return false;
//     }
//   }
//   return false;
// };

const deleteById = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const result = await CategoryModel.deleteOne({ _id: id });
      return result.deletedCount >= 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};

// // c2 using findByIdAndDelete
// const deleteById = async (id) => {
//   if (mongoose.isValidObjectId(id)) {
//     try {
//       const deletedUser = await User.findByIdAndDelete(id);
//       return !!deletedUser;
//     } catch (error) {
//       console.error(error);
//       return false;
//     }
//   }
//   return false;
// };

export const Category = {
  paginate,
  find,
  findById,
  create,
  updateById,
  deleteById,
};
