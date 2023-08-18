import Joi from "joi";
import { Controller, Get, Post, Put, Validate } from "../core/decorator/router";

@Controller("/demo")
export class DemoController {
  @Validate(
    Joi.object({
      query: Joi.string().required(),
    })
  )
  @Get()
  getDemo1() {
    return {
      getDemo1: 234234,
    };
  }

  @Get("/demo2")
  getDemo2() {
    return {
      abc: true,
    };
  }

  @Post("/post")
  @Validate(
    Joi.object({
      username: Joi.string().required().email(),
    })
  )
  postDemo3() {
    return { post: true };
  }

  @Put("/post")
  putDemo4() {
    return { put: true };
  }
}
