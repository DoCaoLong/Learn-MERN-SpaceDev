import _ from "lodash";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // hiden field pass khi get list user
  },
  code: {
    type: String,
    default: null,
    unique: true,
  },
});

export const UserModel = mongoose.model("User", UserSchema);

const paginate = (query) => {
  return UserModel.paginate(query);
};

const find = async (query) => {};

const findById = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return null;
};

const create = async (data) => {
  const newUser = new UserModel(data);
  try {
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const updateById = async (id, dataUpdate) => {
  if (mongoose.isValidObjectId(id)) {
    try {
      const result = await UserModel.updateOne(
        { _id: id },
        { $set: dataUpdate }
      );
      // return result;
      return dataUpdate;
    } catch (error) {
      return false;
    }
  }
  return false;
};

// c2 using findByIdAndUpdate
// const updateById = async (id, dataUpdate) => {
//   if (mongoose.isValidObjectId(id)) {
//     try {
//       const updatedUser = await UserModel.findByIdAndUpdate(id, dataUpdate, {
//         new: true,
//       });
//       return !!updatedUser;
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
      const result = await UserModel.deleteOne({ _id: id });
      return result.deletedCount >= 1;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};

// c2 using findByIdAndDelete
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

export const User = {
  paginate,
  find,
  findById,
  create,
  updateById,
  deleteById,
};
