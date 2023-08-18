import { config } from "dotenv";
import { AppDecorator, BaseApp } from "./core/decorator/AppDecorator";
import "./core/decorator/demo";
// import { DemoController } from "./controllers/demo.controller";

config();
let port = process.env.PORT;

// @AppDecorator({
//   controllers: [DemoController],
// })
@AppDecorator() // factory decorator
class App extends BaseApp {}

let app = new App();

app.listen(port, () => {
  console.log(`Server runing at http://localhost:${port}`);
});
