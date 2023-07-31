import chalk from "chalk";
import moment from "moment";
import fs from "fs";
import { BadRequest } from "../config/statusCode";
import { HttpResponse } from "../utils/HttpResponse";

export const errorMiddleware = (err, req, res, next) => {
  let log = `\n${req.method}: ${req.url} - ${moment().format(
    "DD/MM/YYYY"
  )}: ${JSON.stringify(req.body)} - ${err}`;

  console.log(chalk.red(log));

  fs.appendFile(`./errors/${moment().format("DD-MM-YYYY")}.txt`, log, () => {});

  res.status(BadRequest).json(HttpResponse.error(err));
};
