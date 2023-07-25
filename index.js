import express from "express";
const app = express();
import { config } from "dotenv";
import cors from "cors";
import taskRouter from "./src/routes/task.route";
import categoryRouter from "./src/routes/category.route";
import userRouter from "./src/routes/user.route";

config();

const port = process.env.PORT;

// nhận và xử lý dữ liệu JSON gửi đến từ phía client
app.use(express.json());

app.use(cors());

app.use("/task", taskRouter);

app.use("/categories", categoryRouter);

app.use("/user", userRouter);

app.all("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log("Server run at port:", port);
});
