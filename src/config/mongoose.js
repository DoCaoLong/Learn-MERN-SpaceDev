import _ from "lodash";
import mongoose from "mongoose";
import "../utils/mongoose-plugin";

const stringConnect = "mongodb://localhost:27017";

const dbName = "spacedev-mern";

mongoose.set("toJSON", {
  transform: (doc, record) => {
    record.id = record._id;
    delete record._id;
  },
});

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
