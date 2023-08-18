import chalk from "chalk";
import moment from "moment";
import fs from "fs";
import { BadRequest } from "../config/statusCode";
import { HttpResponse } from "../utils/HttpResponse";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let log = `\n${req.method}: ${req.url} - ${moment().format(
    "DD/MM/YYYY"
  )}: ${JSON.stringify(req.body)} - ${err}`;

  console.log(chalk.red(log));

  fs.appendFile(`./errors/${moment().format("DD-MM-YYYY")}.txt`, log, () => {});

  res.status(BadRequest).json(HttpResponse.error(err));
};
