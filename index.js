import "./src/config/mongoose";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import taskRouter from "./src/routes/task.route";
import categoryRouter from "./src/routes/category.route";
import userRouter from "./src/routes/user.route";
// import { logMiddleware } from "./src/middleware/log.middleware";
import { errorMiddleware } from "./src/middleware/error.middleware";
import { fileRouter } from "./src/routes/file.router";
import { randomUUID } from "crypto";
import morgan from "morgan";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { pageRouter } from "./src/routes/page.route";
import handlebars from "express-handlebars";
// import { xTokenMiddleware } from "./src/middleware/x-token-middleware";
// import "./src/config/database";
import { authRouter } from "./src/routes/auth.route";

const app = express();

// chống hacker lỏ
app.use(helmet());

// __dirname chỉ dùng đc trong es nên phải khai báo lại
// import.meta.url: lấy vị trí file hiện tại đang đứng
const __filename = fileURLToPath(import.meta.url); // -> /Users/longdc/Desktop/spavedev-learn/index.js

const __dirname = dirname(__filename); // -> /Users/longdc/Desktop/spavedev-learn

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logs/access.log"), // -> /Users/longdc/Desktop/spavedev-learn/logs/access.log
  { flags: "a" }
);

// token logs morgan
morgan.token("id", function getId(req) {
  return req.id;
});

config();

const port = process.env.PORT;

function assignId(req, res, next) {
  req.id = randomUUID();
  next();
}

// config handlebar
const hdb = handlebars.create({
  extname: ".html",
});
app.engine("html", hdb.engine);
app.set("view engine", "html");
app.set("views", path.resolve(__dirname, "./src/views"));

// nhận và xử lý dữ liệu JSON gửi đến từ phía client
app.use(express.json());

app.use(cors());

// app.use(logMiddleware);

app.use(assignId);

// custom logs morgan
app.use(morgan("combined", { stream: accessLogStream }));

// upload file
app.use("/upload", express.static("./upload"));

// cho phép client truy cập file public
app.use(express.static("./public"));

// tăng bảo mật
// app.use(xTokenMiddleware);

app.use("/task", taskRouter);

app.use("/categories", categoryRouter);

app.use("/user", userRouter);

app.use("/file", fileRouter);

app.use("/auth", authRouter);

app.use(pageRouter);

app.use(errorMiddleware);

// app.all("*", (req, res) => {
//   // res.status(NotFound).json({ error: "File Not Found" });
//   res.render("404");
// });

app.listen(port, () => {
  console.log("Server run at port:", port);
});
