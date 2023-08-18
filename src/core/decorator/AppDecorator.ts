import { config } from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { create } from "express-handlebars";
import { errorMiddleware } from "../../middleware/error.middleware";

interface AppDecoratorOptions {
  controllers?: any[];
}

export const AppDecorator = (options?: AppDecoratorOptions) => {
  let { controllers } = options || {};
  return (target: any) => {
    return class extends target {
      app: Express;
      constructor() {
        super();
        this.app = express();

        // const accessLogStream = fs.createWriteStream(
        //   path.join(__dirname, "./logs/access.log"),
        //   { flags: "a" }
        // );
        // const {config} = require('dotenv')

        // morgan.token("id", (req) => {
        //   return req.id;
        // });

        config();
        // function assignId(req, res, next) {
        //   req.id = randomUUID();
        //   next();
        // }

        const hdb = create({
          extname: ".html",
        });
        this.app.engine("html", hdb.engine);
        this.app.set("view engine", "html");
        this.app.set("views", path.resolve(__dirname, "./src/views"));

        this.app.use(express.json());
        this.app.use(cors());

        this.app.use(helmet());
        // this.app.use(assignId);

        // this.app.use(logMiddleware)
        // this.app.use(morgan("combined", { stream: accessLogStream }));
        this.app.use("/upload", express.static("./upload"));
        this.app.use(express.static("./public"));

        // this.app.use(xTokenMiddleware)

        if (Array.isArray(controllers) && controllers.length > 0) {
          for (let i in controllers) {
            new controllers[i](this.app);
          }
        }

        // this.app.use("/task", taskRouter);
        // this.app.use("/category", categoryRouter);
        // this.app.use("/user", userRouter);
        // this.app.use("/file", fileRouter);
        // this.app.use("/auth", authRouter);

        // this.app.use(pageRouter);

        this.app.use(errorMiddleware);

        // this.app.all("*", (req, res) => {
        //   res.status(404).json({ error: "Not Found" });
        // });
      }

      listen(port: number | string | undefined, cb: () => void) {
        this.app.listen(port, cb);
      }
    };
  };
};

// mục đích là để nhắc lệnh
export class BaseApp {
  listen(port: number | string | undefined, cb: Function) {}
}
