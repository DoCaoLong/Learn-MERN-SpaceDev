import mongoose from "mongoose";
import "../utils/mongoose-plugin";

const stringConnect = "mongodb://localhost:27017";

const dbName = "spacedev-mern";

const main = async () => {
  await mongoose.connect(stringConnect, {
    auth: {
      username: "root",
      password: "example",
    },
    dbName: dbName,
  });
  console.log("Connected successfully to mongodb (mongoose)");
};

await main();
