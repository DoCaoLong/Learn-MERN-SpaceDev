import { MongoClient } from "mongodb";
import { initPlugin } from "../utils/mongodb-plugin";

const stringConnect = "mongodb://root:example@localhost:27017";

const dbName = "spacedev-mern";

const client = new MongoClient(stringConnect);

const main = async () => {
  await client.connect();
  console.log("Connected successfully to mongodb");
  const db = client.db(dbName);

  const Task = db.collection("tasks");
  const Category = db.collection("categories");
  const User = db.collection("users");

  // search theo index text
  Task.createIndex({ title: "text" });
  User.createIndex({ name: "text" });
  Category.createIndex({ name: "text" });

  // plugin
  initPlugin({
    Task,
    Category,
    User,
  });

  return {
    Task,
    Category,
    User,
  };
};

let collection = await main();

export const { Category, Task, User } = collection;

// mỗi trang có 3 sản phẩm
export const DEFAULT_LIMIT = 3;
