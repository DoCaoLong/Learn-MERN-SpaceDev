import express from "express";
const app = express();
app.listen(123, () => {
  console.log("Server run at port:", 123);
});
